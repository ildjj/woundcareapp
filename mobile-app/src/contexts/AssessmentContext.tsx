import React, { createContext, useContext, useState } from 'react';

interface WoundAssessment {
  id: string;
  patientId: string;
  patientName: string;
  woundType: string;
  woundLocation: string;
  woundStage: string;
  measurements: {
    length: number;
    width: number;
    depth: number;
    area: number;
  };
  painLevel: string;
  exudateType: string;
  exudateAmount: string;
  tissueTypes: {
    necrotic: boolean;
    slough: boolean;
    granulation: boolean;
    epithelialization: boolean;
  };
  infectionSigns: {
    redness: boolean;
    swelling: boolean;
    warmth: boolean;
    odor: boolean;
    purulent: boolean;
  };
  bwatScore?: number;
  severity?: string;
  recommendations?: string[];
  timestamp: string;
  images?: string[];
}

interface AssessmentContextType {
  assessments: WoundAssessment[];
  currentAssessment: WoundAssessment | null;
  addAssessment: (assessment: Omit<WoundAssessment, 'id' | 'timestamp'>) => Promise<void>;
  updateAssessment: (id: string, assessment: Partial<WoundAssessment>) => Promise<void>;
  deleteAssessment: (id: string) => Promise<void>;
  getAssessment: (id: string) => WoundAssessment | undefined;
  getPatientAssessments: (patientId: string) => WoundAssessment[];
  setCurrentAssessment: (assessment: WoundAssessment | null) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<WoundAssessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<WoundAssessment | null>(null);

  const addAssessment = async (assessmentData: Omit<WoundAssessment, 'id' | 'timestamp'>) => {
    const newAssessment: WoundAssessment = {
      ...assessmentData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setAssessments(prev => [newAssessment, ...prev]);
  };

  const updateAssessment = async (id: string, updates: Partial<WoundAssessment>) => {
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === id 
          ? { ...assessment, ...updates }
          : assessment
      )
    );
  };

  const deleteAssessment = async (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const getAssessment = (id: string) => {
    return assessments.find(assessment => assessment.id === id);
  };

  const getPatientAssessments = (patientId: string) => {
    return assessments.filter(assessment => assessment.patientId === patientId);
  };

  const value = {
    assessments,
    currentAssessment,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessment,
    getPatientAssessments,
    setCurrentAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};