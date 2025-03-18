
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import type { HealingGoal } from '@/server/services/goals';

interface GoalTrackerProps {
  assessmentId: number;
  currentMeasurements: {
    length: number;
    width: number;
    depth: number;
  };
}

export function GoalTracker({ assessmentId, currentMeasurements }: GoalTrackerProps) {
  const [goals, setGoals] = useState<HealingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createGoal = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          woundAssessmentId: assessmentId,
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          targetSize: {
            length: currentMeasurements.length * 0.7, // 30% reduction
            width: currentMeasurements.width * 0.7,
            depth: currentMeasurements.depth * 0.7
          },
          targetGranulation: 80,
          status: 'pending',
          notes: 'Target 30% size reduction in 2 weeks'
        }),
      });
      
      const newGoal = await response.json();
      setGoals([...goals, newGoal]);
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Healing Goals</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Button 
          onClick={createGoal} 
          disabled={isLoading}
          className="mb-4"
        >
          Set New Goal
        </Button>
        
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">
                Goal for {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
              </h3>
              <div className="space-y-2 text-sm">
                <p>Target Size: {goal.targetSize.length}cm x {goal.targetSize.width}cm x {goal.targetSize.depth}cm</p>
                <p>Target Granulation: {goal.targetGranulation}%</p>
                <p>Status: <span className={`font-medium ${
                  goal.status === 'achieved' ? 'text-green-600' :
                  goal.status === 'missed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>{goal.status}</span></p>
                <p className="text-gray-600">{goal.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
