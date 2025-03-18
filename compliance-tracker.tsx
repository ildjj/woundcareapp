
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ComplianceTrackerProps {
  metrics: {
    protocolAdherence: number;
    dressingChangeCompliance: number;
    medicationAdherence: number;
    followUpAttendance: number;
    overallCompliance: number;
  };
}

export function ComplianceTracker({ metrics }: ComplianceTrackerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Treatment Compliance Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Protocol Adherence</span>
            <span>{Math.round(metrics.protocolAdherence)}%</span>
          </div>
          <Progress value={metrics.protocolAdherence} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Dressing Changes</span>
            <span>{Math.round(metrics.dressingChangeCompliance)}%</span>
          </div>
          <Progress value={metrics.dressingChangeCompliance} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Medication Adherence</span>
            <span>{Math.round(metrics.medicationAdherence)}%</span>
          </div>
          <Progress value={metrics.medicationAdherence} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span>Follow-up Attendance</span>
            <span>{Math.round(metrics.followUpAttendance)}%</span>
          </div>
          <Progress value={metrics.followUpAttendance} className="h-2" />
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Overall Compliance</span>
            <span className="font-semibold">{Math.round(metrics.overallCompliance)}%</span>
          </div>
          <Progress value={metrics.overallCompliance} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
