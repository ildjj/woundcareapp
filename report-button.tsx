
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportButtonProps {
  patientId: number;
}

export function ReportButton({ patientId }: ReportButtonProps) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/reports/${patientId}/export-pdf`, {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient-report-${patientId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export Report
    </Button>
  );
}
