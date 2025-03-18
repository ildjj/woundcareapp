
import type { WoundAssessment } from '@/shared/schema';

export interface TreatmentProtocol {
  id: string;
  name: string;
  woundType: string;
  woundStage: string;
  primaryDressing: string;
  secondaryDressing?: string;
  frequency: string;
  additionalSteps: string[];
  contraindications: string[];
}

const protocolDatabase: TreatmentProtocol[] = [
  {
    id: "pi_stage2",
    name: "Stage 2 Pressure Injury Protocol",
    woundType: "pressure_injury",
    woundStage: "stage2",
    primaryDressing: "Foam Dressing",
    frequency: "Every 3 days",
    additionalSteps: [
      "Cleanse wound with saline",
      "Pat dry periwound",
      "Apply barrier cream to periwound",
      "Document wound measurements"
    ],
    contraindications: [
      "Signs of infection",
      "Heavy exudate"
    ]
  },
  {
    id: "df_wagner2",
    name: "Wagner Grade 2 Diabetic Foot Protocol",
    woundType: "diabetic_foot",
    woundStage: "wagner2",
    primaryDressing: "Antimicrobial Dressing",
    secondaryDressing: "Absorbent Pad",
    frequency: "Daily",
    additionalSteps: [
      "Debride if needed",
      "Assess for infection",
      "Offloading required",
      "Monitor glucose levels"
    ],
    contraindications: [
      "Uncontrolled diabetes",
      "Critical ischemia"
    ]
  }
];

export function getProtocolsForWound(assessment: WoundAssessment): TreatmentProtocol[] {
  return protocolDatabase.filter(protocol => 
    protocol.woundType === assessment.woundType && 
    protocol.woundStage === assessment.woundStage
  );
}
