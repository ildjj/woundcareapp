import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
  woundType: string;
  status: 'active' | 'healing' | 'critical' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface DatabaseContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
  saveData: () => Promise<void>;
  loadData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Load data on app start
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('patients', JSON.stringify(patients));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async () => {
    try {
      const storedPatients = await AsyncStorage.getItem('patients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setPatients([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPatients(prev => [...prev, newPatient]);
    await saveData();
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      )
    );
    await saveData();
  };

  const deletePatient = async (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    await saveData();
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const value: DatabaseContextType = {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    saveData,
    loadData,
    clearAllData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};