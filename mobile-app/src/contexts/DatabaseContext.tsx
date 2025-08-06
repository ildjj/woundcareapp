import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  contactInfo: string;
  createdAt: string;
}

interface WoundImage {
  id: string;
  patientId: string;
  assessmentId: string;
  imagePath: string;
  timestamp: string;
  notes: string;
}

interface DatabaseContextType {
  isInitialized: boolean;
  initDatabase: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<string>;
  getPatients: () => Promise<Patient[]>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addWoundImage: (image: Omit<WoundImage, 'id' | 'timestamp'>) => Promise<string>;
  getWoundImages: (patientId?: string) => Promise<WoundImage[]>;
  deleteWoundImage: (id: string) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const db = await SQLite.openDatabase({
        name: 'WoundCareDB',
        location: 'default',
      });

      // Create tables
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER,
          diagnosis TEXT,
          contactInfo TEXT,
          createdAt TEXT NOT NULL
        );
      `);

      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS assessments (
          id TEXT PRIMARY KEY,
          patientId TEXT NOT NULL,
          patientName TEXT NOT NULL,
          woundType TEXT,
          woundLocation TEXT,
          woundStage TEXT,
          length REAL,
          width REAL,
          depth REAL,
          area REAL,
          painLevel TEXT,
          exudateType TEXT,
          exudateAmount TEXT,
          necroticTissue BOOLEAN,
          sloughTissue BOOLEAN,
          granulationTissue BOOLEAN,
          epithelializationTissue BOOLEAN,
          redness BOOLEAN,
          swelling BOOLEAN,
          warmth BOOLEAN,
          odor BOOLEAN,
          purulent BOOLEAN,
          bwatScore INTEGER,
          severity TEXT,
          recommendations TEXT,
          timestamp TEXT NOT NULL,
          FOREIGN KEY (patientId) REFERENCES patients (id)
        );
      `);

      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS wound_images (
          id TEXT PRIMARY KEY,
          patientId TEXT NOT NULL,
          assessmentId TEXT NOT NULL,
          imagePath TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          notes TEXT,
          FOREIGN KEY (patientId) REFERENCES patients (id),
          FOREIGN KEY (assessmentId) REFERENCES assessments (id)
        );
      `);

      setDatabase(db);
      setIsInitialized(true);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const addPatient = async (patient: Omit<Patient, 'id' | 'createdAt'>): Promise<string> => {
    if (!database) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    await database.executeSql(
      'INSERT INTO patients (id, name, age, diagnosis, contactInfo, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, patient.name, patient.age, patient.diagnosis, patient.contactInfo, createdAt]
    );

    return id;
  };

  const getPatients = async (): Promise<Patient[]> => {
    if (!database) throw new Error('Database not initialized');

    const [results] = await database.executeSql('SELECT * FROM patients ORDER BY createdAt DESC');
    const patients: Patient[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      patients.push(results.rows.item(i));
    }

    return patients;
  };

  const updatePatient = async (id: string, updates: Partial<Patient>): Promise<void> => {
    if (!database) throw new Error('Database not initialized');

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    await database.executeSql(
      `UPDATE patients SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
  };

  const deletePatient = async (id: string): Promise<void> => {
    if (!database) throw new Error('Database not initialized');

    await database.executeSql('DELETE FROM patients WHERE id = ?', [id]);
  };

  const addWoundImage = async (image: Omit<WoundImage, 'id' | 'timestamp'>): Promise<string> => {
    if (!database) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const timestamp = new Date().toISOString();

    await database.executeSql(
      'INSERT INTO wound_images (id, patientId, assessmentId, imagePath, timestamp, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [id, image.patientId, image.assessmentId, image.imagePath, timestamp, image.notes]
    );

    return id;
  };

  const getWoundImages = async (patientId?: string): Promise<WoundImage[]> => {
    if (!database) throw new Error('Database not initialized');

    let query = 'SELECT * FROM wound_images';
    let params: string[] = [];

    if (patientId) {
      query += ' WHERE patientId = ?';
      params.push(patientId);
    }

    query += ' ORDER BY timestamp DESC';

    const [results] = await database.executeSql(query, params);
    const images: WoundImage[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      images.push(results.rows.item(i));
    }

    return images;
  };

  const deleteWoundImage = async (id: string): Promise<void> => {
    if (!database) throw new Error('Database not initialized');

    await database.executeSql('DELETE FROM wound_images WHERE id = ?', [id]);
  };

  const exportData = async (): Promise<string> => {
    if (!database) throw new Error('Database not initialized');

    const patients = await getPatients();
    const images = await getWoundImages();

    return JSON.stringify({
      patients,
      images,
      exportDate: new Date().toISOString(),
    });
  };

  const importData = async (data: string): Promise<void> => {
    if (!database) throw new Error('Database not initialized');

    const importData = JSON.parse(data);

    // Clear existing data
    await database.executeSql('DELETE FROM wound_images');
    await database.executeSql('DELETE FROM assessments');
    await database.executeSql('DELETE FROM patients');

    // Import patients
    for (const patient of importData.patients) {
      await addPatient(patient);
    }

    // Import images
    for (const image of importData.images) {
      await addWoundImage(image);
    }
  };

  const value = {
    isInitialized,
    initDatabase,
    addPatient,
    getPatients,
    updatePatient,
    deletePatient,
    addWoundImage,
    getWoundImages,
    deleteWoundImage,
    exportData,
    importData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};