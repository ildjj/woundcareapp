
import type { WoundAssessment } from '@/shared/schema';

export interface HealingGoal {
  id: string;
  woundAssessmentId: number;
  targetDate: Date;
  targetSize: {
    length: number;
    width: number;
    depth: number;
  };
  targetGranulation: number;
  status: 'pending' | 'achieved' | 'missed';
  notes: string;
}

const goalsDatabase: HealingGoal[] = [];

export function createHealingGoal(goal: Omit<HealingGoal, 'id'>): HealingGoal {
  const newGoal = {
    ...goal,
    id: `goal_${Date.now()}`
  };
  goalsDatabase.push(newGoal);
  return newGoal;
}

export function getGoalsForAssessment(assessmentId: number): HealingGoal[] {
  return goalsDatabase.filter(goal => goal.woundAssessmentId === assessmentId);
}

export function updateGoalStatus(goalId: string, status: HealingGoal['status']): HealingGoal | null {
  const goalIndex = goalsDatabase.findIndex(g => g.id === goalId);
  if (goalIndex === -1) return null;
  
  goalsDatabase[goalIndex].status = status;
  return goalsDatabase[goalIndex];
}
