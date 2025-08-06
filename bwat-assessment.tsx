import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface BWATAssessmentProps {
  isDisabled: boolean;
}

interface BWATItem {
  name: string;
  description: string;
  options: { value: number; label: string; description: string }[];
}

const BWAT_ITEMS: BWATItem[] = [
  {
    name: "size",
    description: "Wound size in cm²",
    options: [
      { value: 1, label: "1", description: "≤ 4 cm²" },
      { value: 2, label: "2", description: "4.1-16 cm²" },
      { value: 3, label: "3", description: "16.1-36 cm²" },
      { value: 4, label: "4", description: "36.1-80 cm²" },
      { value: 5, label: "5", description: "> 80 cm²" }
    ]
  },
  {
    name: "depth",
    description: "Wound depth",
    options: [
      { value: 1, label: "1", description: "No depth" },
      { value: 2, label: "2", description: "Superficial" },
      { value: 3, label: "3", description: "Partial thickness" },
      { value: 4, label: "4", description: "Full thickness" },
      { value: 5, label: "5", description: "Deep tissue injury" }
    ]
  },
  {
    name: "edges",
    description: "Wound edges",
    options: [
      { value: 1, label: "1", description: "Indistinct, diffuse, none clearly visible" },
      { value: 2, label: "2", description: "Distinct, attached, even with wound base" },
      { value: 3, label: "3", description: "Well-defined, not attached to wound base" },
      { value: 4, label: "4", description: "Well-defined, not attached to base, rolled under, thickened" },
      { value: 5, label: "5", description: "Well-defined, fibrotic, scarred or retracted" }
    ]
  },
  {
    name: "undermining",
    description: "Undermining",
    options: [
      { value: 1, label: "1", description: "None visible" },
      { value: 2, label: "2", description: "< 2 cm under 1 edge" },
      { value: 3, label: "3", description: "< 2 cm under 2 edges" },
      { value: 4, label: "4", description: "2-5 cm under 2 edges" },
      { value: 5, label: "5", description: "> 5 cm under 2 edges" }
    ]
  },
  {
    name: "necroticTissueType",
    description: "Necrotic tissue type",
    options: [
      { value: 1, label: "1", description: "None visible" },
      { value: 2, label: "2", description: "White/gray non-viable tissue" },
      { value: 3, label: "3", description: "Yellow slough" },
      { value: 4, label: "4", description: "Brown/black necrotic tissue" },
      { value: 5, label: "5", description: "Eschar" }
    ]
  },
  {
    name: "necroticTissueAmount",
    description: "Necrotic tissue amount",
    options: [
      { value: 1, label: "1", description: "None" },
      { value: 2, label: "2", description: "< 25%" },
      { value: 3, label: "3", description: "25-50%" },
      { value: 4, label: "4", description: "50-75%" },
      { value: 5, label: "5", description: "75-100%" }
    ]
  },
  {
    name: "exudateType",
    description: "Exudate type",
    options: [
      { value: 1, label: "1", description: "None" },
      { value: 2, label: "2", description: "Bloody" },
      { value: 3, label: "3", description: "Serosanguineous" },
      { value: 4, label: "4", description: "Serous" },
      { value: 5, label: "5", description: "Purulent" }
    ]
  },
  {
    name: "exudateAmount",
    description: "Exudate amount",
    options: [
      { value: 1, label: "1", description: "None" },
      { value: 2, label: "2", description: "Scant" },
      { value: 3, label: "3", description: "Small" },
      { value: 4, label: "4", description: "Moderate" },
      { value: 5, label: "5", description: "Large" }
    ]
  },
  {
    name: "skinColor",
    description: "Skin color surrounding wound",
    options: [
      { value: 1, label: "1", description: "Normal for ethnicity" },
      { value: 2, label: "2", description: "Pink to bright red" },
      { value: 3, label: "3", description: "Bright red to deep red" },
      { value: 4, label: "4", description: "Deep red to purple" },
      { value: 5, label: "5", description: "Black" }
    ]
  },
  {
    name: "peripheralEdema",
    description: "Peripheral tissue edema",
    options: [
      { value: 1, label: "1", description: "None" },
      { value: 2, label: "2", description: "≤ 1 cm around wound" },
      { value: 3, label: "3", description: "1-3 cm around wound" },
      { value: 4, label: "4", description: "3-5 cm around wound" },
      { value: 5, label: "5", description: "> 5 cm around wound" }
    ]
  },
  {
    name: "peripheralInduration",
    description: "Peripheral tissue induration",
    options: [
      { value: 1, label: "1", description: "None" },
      { value: 2, label: "2", description: "≤ 1 cm around wound" },
      { value: 3, label: "3", description: "1-3 cm around wound" },
      { value: 4, label: "4", description: "3-5 cm around wound" },
      { value: 5, label: "5", description: "> 5 cm around wound" }
    ]
  },
  {
    name: "granulationTissue",
    description: "Granulation tissue",
    options: [
      { value: 1, label: "1", description: "Bright, beefy red, 75-100% of wound bed" },
      { value: 2, label: "2", description: "Bright, beefy red, 25-75% of wound bed" },
      { value: 3, label: "3", description: "Bright, beefy red, < 25% of wound bed" },
      { value: 4, label: "4", description: "Pink and/or dull, red, 25-75% of wound bed" },
      { value: 5, label: "5", description: "Pink and/or dull, red, < 25% of wound bed" }
    ]
  },
  {
    name: "epithelialization",
    description: "Epithelialization",
    options: [
      { value: 1, label: "1", description: "100% of wound covered" },
      { value: 2, label: "2", description: "75-99% of wound covered" },
      { value: 3, label: "3", description: "50-74% of wound covered" },
      { value: 4, label: "4", description: "25-49% of wound covered" },
      { value: 5, label: "5", description: "< 25% of wound covered" }
    ]
  }
];

export default function BWATAssessment({ isDisabled }: BWATAssessmentProps) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  
  // Watch all BWAT values
  const bwatValues = watch([
    "bwat.size", "bwat.depth", "bwat.edges", "bwat.undermining",
    "bwat.necroticTissueType", "bwat.necroticTissueAmount", "bwat.exudateType",
    "bwat.exudateAmount", "bwat.skinColor", "bwat.peripheralEdema",
    "bwat.peripheralInduration", "bwat.granulationTissue", "bwat.epithelialization"
  ]);

  // Calculate total BWAT score
  const totalScore = bwatValues.reduce((sum, value) => sum + (value || 0), 0);
  
  // Determine severity level
  const getSeverityLevel = (score: number) => {
    if (score <= 13) return { level: "Minimal", color: "bg-green-100 text-green-800" };
    if (score <= 20) return { level: "Mild", color: "bg-yellow-100 text-yellow-800" };
    if (score <= 30) return { level: "Moderate", color: "bg-orange-100 text-orange-800" };
    if (score <= 40) return { level: "Severe", color: "bg-red-100 text-red-800" };
    return { level: "Very Severe", color: "bg-purple-100 text-purple-800" };
  };

  const severity = getSeverityLevel(totalScore);

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>BWAT Assessment</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Total Score: {totalScore}
            </Badge>
            <Badge className={severity.color}>
              {severity.level}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            The Bates-Jensen Wound Assessment Tool (BWAT) evaluates 13 wound characteristics. 
            Total scores: ≤13 (Minimal), 14-20 (Mild), 21-30 (Moderate), 31-40 (Severe), >40 (Very Severe).
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {BWAT_ITEMS.map((item) => (
            <div key={item.name} className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {item.description}
              </Label>
              <Select
                disabled={isDisabled}
                value={watch(`bwat.${item.name}`)?.toString() || ""}
                onValueChange={(value) => setValue(`bwat.${item.name}`, parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select score" />
                </SelectTrigger>
                <SelectContent>
                  {item.options.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label} - {option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[`bwat.${item.name}`] && (
                <p className="text-sm text-red-500">
                  {errors[`bwat.${item.name}`]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Assessment Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Score:</span>
              <span className="ml-2 font-medium">{totalScore}/65</span>
            </div>
            <div>
              <span className="text-gray-500">Severity Level:</span>
              <span className={`ml-2 font-medium ${severity.color}`}>
                {severity.level}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Completion:</span>
              <span className="ml-2 font-medium">
                {bwatValues.filter(v => v !== undefined && v !== null).length}/13 items
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 font-medium ${
                bwatValues.filter(v => v !== undefined && v !== null).length === 13 
                  ? "text-green-600" 
                  : "text-yellow-600"
              }`}>
                {bwatValues.filter(v => v !== undefined && v !== null).length === 13 
                  ? "Complete" 
                  : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}