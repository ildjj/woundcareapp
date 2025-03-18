
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineProps {
  assessments: {
    assessmentDate: string;
    area: number;
    length: number;
    width: number;
    granulationTissue: number;
  }[];
}

export function PatientTimeline({ assessments }: TimelineProps) {
  const timelineData = assessments.map(assessment => ({
    date: new Date(assessment.assessmentDate).toLocaleDateString(),
    area: assessment.area,
    length: assessment.length,
    width: assessment.width,
    healing: assessment.granulationTissue
  }));

  return (
    <Card className="w-full">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Healing Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="area" stroke="#8884d8" name="Wound Area" />
            <Line type="monotone" dataKey="healing" stroke="#82ca9d" name="Healing %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
