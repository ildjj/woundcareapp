import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Patient, InsertPatient } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from "@/components/ui/dialog";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash, 
  AlertTriangle,
  ClipboardList
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface PatientWithAssessments extends Patient {
  assessmentsCount: number;
  latestAssessment?: string;
}

export default function PatientPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);

  // Patient list query
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Create schema for patient form
  const patientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mrn: z.string().min(3, "MRN must be at least 3 characters"),
    age: z.coerce.number().min(1, "Age must be at least 1"),
    gender: z.enum(["Male", "Female", "Other"])
  });

  // Patient form
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      mrn: "",
      age: 0,
      gender: "Male"
    }
  });

  // Add patient mutation
  const addPatientMutation = useMutation({
    mutationFn: async (data: InsertPatient) => {
      const res = await apiRequest("POST", "/api/patients", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setShowAddPatientDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof patientSchema>) => {
    addPatientMutation.mutate(data);
  };

  // Filter patients by search query
  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare patient data with assessments count
  const patientsWithAssessments: PatientWithAssessments[] = filteredPatients?.map(patient => ({
    ...patient,
    assessmentsCount: 0, // In a real app, this would come from the backend
    latestAssessment: "N/A" // In a real app, this would come from the backend
  })) || [];

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileMenu />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 pt-0 md:pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold">Patients</h1>
            <Button 
              onClick={() => setShowAddPatientDialog(true)}
              className="bg-primary text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search patients by name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-1/2 lg:w-1/3"
              />
            </div>
          </div>

          {/* Patients Table */}
          <Card className="mb-8">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-bold">Patient List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading patients...</div>
              ) : patientsWithAssessments.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? "No patients match your search criteria."
                      : "No patients have been added to the system yet."}
                  </p>
                  <Button 
                    onClick={() => setShowAddPatientDialog(true)}
                    className="bg-primary text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Patient
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Assessments</TableHead>
                      <TableHead>Latest Assessment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsWithAssessments.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.mrn}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.assessmentsCount}</TableCell>
                        <TableCell>{patient.latestAssessment}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Link href={`/assessment?patientId=${patient.id}`}>
                              <Button variant="ghost" size="sm">
                                <ClipboardList className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Add Patient Dialog */}
          <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient details below to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Patient full name"
                      className="col-span-3"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500 col-start-2 col-span-3">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mrn" className="text-right">
                      MRN
                    </Label>
                    <Input
                      id="mrn"
                      placeholder="Medical Record Number"
                      className="col-span-3"
                      {...form.register("mrn")}
                    />
                    {form.formState.errors.mrn && (
                      <p className="text-sm text-red-500 col-start-2 col-span-3">
                        {form.formState.errors.mrn.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      className="col-span-3"
                      {...form.register("age")}
                    />
                    {form.formState.errors.age && (
                      <p className="text-sm text-red-500 col-start-2 col-span-3">
                        {form.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">
                      Gender
                    </Label>
                    <div className="col-span-3">
                      <select
                        id="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...form.register("gender")}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddPatientDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addPatientMutation.isPending}
                  >
                    {addPatientMutation.isPending ? "Adding..." : "Add Patient"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Patient Details Dialog */}
          {selectedPatient && (
            <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Patient Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about {selectedPatient.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="text-lg">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">MRN</h3>
                      <p className="text-lg">{selectedPatient.mrn}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Age</h3>
                      <p className="text-lg">{selectedPatient.age}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                      <p className="text-lg">{selectedPatient.gender}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="assessments">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="assessments" className="flex-1">Wound Assessments</TabsTrigger>
                      <TabsTrigger value="history" className="flex-1">Patient History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assessments">
                      <div className="text-center p-4">
                        <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-4">No assessments available for this patient yet.</p>
                        <Link href={`/assessment?patientId=${selectedPatient.id}`}>
                          <Button className="bg-primary text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Assessment
                          </Button>
                        </Link>
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="text-center p-4">
                        <p className="text-gray-600">No historical data available.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                    Close
                  </Button>
                  <Link href={`/assessment?patientId=${selectedPatient.id}`}>
                    <Button className="bg-primary text-white">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      New Assessment
                    </Button>
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}
