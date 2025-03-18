import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { Patient, WoundAssessment } from "@shared/schema";
import { format } from "date-fns";
import { Calculator, Calendar, Ruler } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function HealingTrackerPage() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("area");

  const { data: patients, isLoading: isLoadingPatients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: assessments, isLoading: isLoadingAssessments } = useQuery<WoundAssessment[]>({
    queryKey: [`/api/patients/${selectedPatient}/wound-assessments`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!selectedPatient,
  });

  type ChartDataPoint = {
    date: string;
    area: number;
    length: number;
    width: number;
    depth: number;
    timestamp: number;
    id: number;
    [key: string]: string | number;
  };

  const chartData: ChartDataPoint[] = assessments?.map(assessment => ({
    date: format(new Date(assessment.assessmentDate), "MMM dd"),
    area: assessment.area,
    length: assessment.length,
    width: assessment.width,
    depth: assessment.depth,
    timestamp: new Date(assessment.assessmentDate).getTime(),
    id: assessment.id
  })).sort((a, b) => a.timestamp - b.timestamp) || [];

  const metricOptions = [
    { value: "area", label: "Surface Area" },
    { value: "length", label: "Length" },
    { value: "width", label: "Width" },
    { value: "depth", label: "Depth" }
  ];

  const getMetricLabel = () => {
    const option = metricOptions.find(opt => opt.value === selectedMetric);
    return option ? option.label : "";
  };

  const getMetricUnit = () => {
    return selectedMetric === "area" ? "cm²" : "cm";
  };

  const getMetricColor = () => {
    const colors = {
      area: "#0ea5e9",
      length: "#10b981", 
      width: "#f59e0b",
      depth: "#ef4444"
    };
    return colors[selectedMetric as keyof typeof colors] || "#0ea5e9";
  };

  const calculatePercentChange = () => {
    if (chartData.length < 2) return null;
    
    const firstValue = Number(chartData[0][selectedMetric]);
    const latestValue = Number(chartData[chartData.length - 1][selectedMetric]);
    
    if (firstValue === 0) return null;
    
    const change = ((latestValue - firstValue) / firstValue) * 100;
    return change.toFixed(1);
  };

  const percentChange = calculatePercentChange();
  const isHealing = percentChange !== null ? parseFloat(percentChange) < 0 : false;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wound Healing Tracker</h1>
          <p className="text-muted-foreground">
            Monitor wound healing progress over time and analyze trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patient Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-sm font-medium mb-2 block">
                  Select Patient
                </Label>
                <Select
                  value={selectedPatient?.toString() || ""}
                  onValueChange={(value) => setSelectedPatient(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isLoadingPatients && patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name} ({patient.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator className="my-4" />

                <Label className="text-sm font-medium mb-2 block">
                  Measurement to Track
                </Label>
                <Select
                  value={selectedMetric}
                  onValueChange={setSelectedMetric}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedPatient && !isLoadingAssessments && (
              <>
                {assessments && assessments.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Healing Progress Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date"
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis 
                              label={{ 
                                value: `${getMetricLabel()} (${getMetricUnit()})`, 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' }
                              }} 
                            />
                            <Tooltip 
                              formatter={(value) => [`${value} ${getMetricUnit()}`, getMetricLabel()]}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey={selectedMetric}
                              name={getMetricLabel()}
                              stroke={getMetricColor()}
                              activeDot={{ r: 8 }}
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {percentChange !== null && (
                        <div className={`mt-4 p-4 rounded-md ${isHealing ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${isHealing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mr-3`}>
                              <Calculator className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {isHealing 
                                  ? `Wound is healing - ${getMetricLabel()} decreased by ${Math.abs(parseFloat(percentChange))}%` 
                                  : `Warning: ${getMetricLabel()} increased by ${percentChange}%`}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Comparison between first and latest assessment
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="p-3 rounded-full bg-gray-100 mb-4">
                        <Ruler className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No Assessment Data</h3>
                      <p className="text-muted-foreground mb-4">
                        This patient doesn't have any wound assessments yet to track healing progress.
                      </p>
                      <Button asChild>
                        <a href="/assessment">Create Wound Assessment</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!selectedPatient && (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Select a Patient</h3>
                  <p className="text-muted-foreground">
                    Choose a patient from the dropdown menu to view their wound healing progress over time.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedPatient && assessments && assessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {assessments.map((assessment) => (
                  <Dialog key={assessment.id}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between p-4 h-auto">
                        <div className="text-left">
                          <div className="font-medium mb-1">
                            {format(new Date(assessment.assessmentDate), "MMM dd, yyyy")}
                          </div>
                          <div className="text-sm flex gap-2 text-muted-foreground">
                            <span>{assessment.woundType}</span>
                            <span>•</span>
                            <span>{assessment.woundLocation}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {assessment.area} cm²
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {assessment.length} × {assessment.width} cm
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Assessment Details</DialogTitle>
                        <DialogDescription>
                          {format(new Date(assessment.assessmentDate), "MMMM dd, yyyy")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Wound Type</Label>
                          <div>{assessment.woundType}</div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Location</Label>
                          <div>{assessment.woundLocation} ({assessment.woundSide})</div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Stage</Label>
                          <div>{assessment.woundStage}</div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Dimensions</Label>
                          <div>
                            <div>{assessment.length} × {assessment.width} × {assessment.depth} cm</div>
                            <div className="text-sm text-muted-foreground">Area: {assessment.area} cm²</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Tissue Composition</Label>
                          <div className="space-y-1 text-sm">
                            <div>Necrotic: {assessment.necroticTissue}%</div>
                            <div>Slough: {assessment.sloughTissue}%</div>
                            <div>Granulation: {assessment.granulationTissue}%</div>
                            <div>Epithelialization: {assessment.epithelializationTissue}%</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Exudate</Label>
                          <div>{assessment.exudateLevel || "None"} {assessment.exudateType ? `(${assessment.exudateType})` : ""}</div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Pain Scale</Label>
                          <div>{assessment.painScale}/10</div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                          <Label className="text-muted-foreground">Status</Label>
                          <div className="capitalize">{assessment.status}</div>
                        </div>
                        {assessment.reviewDate && (
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label className="text-muted-foreground">Next Review</Label>
                            <div>{format(new Date(assessment.reviewDate), "MMM dd, yyyy")}</div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}