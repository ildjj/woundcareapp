
import type { WoundAssessment } from '@shared/schema';

export interface ComplianceMetrics {
  protocolAdherence: number;
  dressingChangeCompliance: number;
  medicationAdherence: number;
  followUpAttendance: number;
  overallCompliance: number;
}

export function calculateComplianceMetrics(assessments: WoundAssessment[]): ComplianceMetrics {
  const metrics = {
    protocolAdherence: 0,
    dressingChangeCompliance: 0,
    medicationAdherence: 0,
    followUpAttendance: 0,
    overallCompliance: 0
  };

  if (assessments.length === 0) return metrics;

  const compliantAssessments = assessments.filter(a => 
    a.protocolFollowed && 
    a.dressingChanged && 
    a.medicationTaken
  );

  metrics.protocolAdherence = (compliantAssessments.length / assessments.length) * 100;
  metrics.dressingChangeCompliance = (assessments.filter(a => a.dressingChanged).length / assessments.length) * 100;
  metrics.medicationAdherence = (assessments.filter(a => a.medicationTaken).length / assessments.length) * 100;
  metrics.followUpAttendance = (assessments.filter(a => a.followUpAttended).length / assessments.length) * 100;
  
  metrics.overallCompliance = (
    metrics.protocolAdherence +
    metrics.dressingChangeCompliance +
    metrics.medicationAdherence +
    metrics.followUpAttendance
  ) / 4;

  return metrics;
}
