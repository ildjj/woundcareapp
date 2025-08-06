import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertWoundAssessmentSchema, InsertWoundAssessment, Patient } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import PatientInfo from "@/components/assessment/patient-info";
import WoundClassification from "@/components/assessment/wound-classification";
import WoundMeasurements from "@/components/assessment/wound-measurements";
import WoundBed from "@/components/assessment/wound-bed";
import ExudatePain from "@/components/assessment/exudate-pain";
import Infection from "@/components/assessment/infection";
import Treatment from "@/components/assessment/treatment";
import WoundImages from "@/components/assessment/wound-images";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useLocation } from "wouter";
import { TreatmentRecommendations } from "@/components/ai/treatment-recommendations";
import BWATAssessment from "@/components/assessment/bwat-assessment";
import AIWoundAnalysis from "@/components/assessment/ai-wound-analysis";

export default function AssessmentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const methods = useForm<InsertWoundAssessment>({
    resolver: zodResolver(insertWoundAssessmentSchema),
    defaultValues: {
      patientId: 0,
      woundType: "",
      woundStage: "",
      woundLocation: "",
      woundSide: "",
      length: 0,
      width: 0,
      depth: 0,
      area: 0,
      necroticTissue: 0,
      sloughTissue: 0,
      granulationTissue: 0,
      epithelializationTissue: 0,
      painScale: 0,
      woundEdge: {
        attached: false,
        undermining: false,
        macerated: false,
        rolled: false
      },
      periWound: {
        maceration: false,
        healthy: false,
        cellulitis: false,
        rash: false
      },
      nerdsAssessment: {
        nonHealing: false,
        exudateIncreased: false,
        redBleeding: false,
        debris: false,
        smell: false
      },
      stoneesAssessment: {
        sizeIncreasing: false,
        temperatureIncreased: false,
        osExposed: false,
        newAreas: false,
        exudateIncreasing: false,
        erythemaEdema: false,
        smell: false
      },
      npwtRequired: false,
      offloadingRequired: false,
      woundImages: [],
      reviewDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default review date 7 days in future
      status: "active",
      createdBy: 1 // Default to admin for demo
    },
  });

  const assessmentMutation = useMutation({
    mutationFn: async (data: InsertWoundAssessment) => {
      const res = await apiRequest("POST", "/api/wound-assessments", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wound assessment created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wound-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wound-assessments/recent"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save assessment",
        variant: "destructive",
      });
    },
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    methods.setValue("patientId", patient.id);
  };

  const onSubmit = (data: InsertWoundAssessment) => {
    console.log("Form data", data);
    console.log("Errors", methods.formState.errors);
    
    // Ensure all required fields are set
    if (!data.patientId) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    // Validate required measurements
    if (data.length <= 0 || data.width <= 0 || data.depth <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid wound measurements (length, width, depth)",
        variant: "destructive",
      });
      return;
    }

    // Convert measurements to numbers to ensure they're saved correctly
    const processedData = {
      ...data,
      length: Number(data.length),
      width: Number(data.width),
      depth: Number(data.depth),
      area: Number(data.area)
    };

    assessmentMutation.mutate(processedData);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileMenu />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 pt-0 md:pt-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Wound Assessment</h1>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/")}
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-primary text-white"
                    disabled={assessmentMutation.isPending}
                  >
                    <Save className="mr-1 h-4 w-4" /> 
                    {assessmentMutation.isPending ? "Saving..." : "Save Assessment"}
                  </Button>
                </div>
              </div>

              <PatientInfo onPatientSelect={handlePatientSelect} />
              
              <WoundClassification isDisabled={!selectedPatient} />
              
              <WoundMeasurements isDisabled={!selectedPatient} />
              
              <WoundBed isDisabled={!selectedPatient} />
              
              <ExudatePain isDisabled={!selectedPatient} />
              
              <Infection isDisabled={!selectedPatient} />
              
              <WoundImages isDisabled={!selectedPatient} />
              
              <Treatment isDisabled={!selectedPatient} />
              
              <BWATAssessment isDisabled={!selectedPatient} />
              
              <AIWoundAnalysis isDisabled={!selectedPatient} />
              
              <TreatmentRecommendations />
              
              <div className="flex justify-end space-x-4 mb-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/")}
                >
                  <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-white"
                  disabled={assessmentMutation.isPending}
                >
                  <Save className="mr-1 h-4 w-4" /> 
                  {assessmentMutation.isPending ? "Saving..." : "Save Assessment"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </main>
      </div>
    </div>
  );
}
