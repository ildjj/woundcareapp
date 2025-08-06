import React, { createContext, useContext, useState } from 'react';

interface AssessmentData {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  woundType: string;
  location: string;
  measurements: {
    length: number;
    width: number;
    depth: number;
    area: number;
  };
  woundBed: {
    necroticTissue: number;
    sloughTissue: number;
    granulationTissue: number;
    epithelializationTissue: number;
  };
  bwatScore: number;
  severity: string;
  treatment: string;
  notes: string;
  images: string[];
}

interface AssessmentContextType {
  assessments: AssessmentData[];
  currentAssessment: AssessmentData | null;
  addAssessment: (assessment: AssessmentData) => void;
  updateAssessment: (id: string, assessment: Partial<AssessmentData>) => void;
  deleteAssessment: (id: string) => void;
  setCurrentAssessment: (assessment: AssessmentData | null) => void;
  getAssessmentsByPatient: (patientId: string) => AssessmentData[];
  getAssessmentById: (id: string) => AssessmentData | undefined;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: React.ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);

  const addAssessment = (assessment: AssessmentData) => {
    setAssessments(prev => [...prev, assessment]);
  };

  const updateAssessment = (id: string, updates: Partial<AssessmentData>) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === id ? { ...assessment, ...updates } : assessment
      )
    );
  };

  const deleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const getAssessmentsByPatient = (patientId: string) => {
    return assessments.filter(assessment => assessment.patientId === patientId);
  };

  const getAssessmentById = (id: string) => {
    return assessments.find(assessment => assessment.id === id);
  };

  const value: AssessmentContextType = {
    assessments,
    currentAssessment,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    setCurrentAssessment,
    getAssessmentsByPatient,
    getAssessmentById,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};