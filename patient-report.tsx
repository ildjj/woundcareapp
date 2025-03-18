
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from 'date-fns';
import type { Patient, WoundAssessment } from '@/shared/schema';

interface PatientReportProps {
  patient: Patient;
  assessments: WoundAssessment[];
}

export function PatientReport({ patient, assessments }: PatientReportProps) {
  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/reports/${patient.id}/export-pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient-report-${patient.mrn}.pdf`;
      a.click();
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold">Patient Report</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => window.print()} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">MRN</p>
                <p className="font-medium">{patient.mrn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Wound Assessment History</h3>
            <div className="space-y-4">
              {assessments.map((assessment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {format(new Date(assessment.assessmentDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">
                        {assessment.length}cm x {assessment.width}cm x {assessment.depth}cm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stage</p>
                      <p className="font-medium">{assessment.woundStage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{assessment.status}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Granulation</p>
                      <p className="font-medium">{assessment.granulationTissue}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Exudate Level</p>
                      <p className="font-medium">{assessment.exudateLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pain Scale</p>
                      <p className="font-medium">{assessment.painScale}/10</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Treatment</p>
                      <p className="font-medium">{assessment.dressingType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
