import { users, type User, type InsertUser, patients, type Patient, type InsertPatient, woundAssessments, type WoundAssessment, type InsertWoundAssessment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Fix for SessionStore type
declare module "express-session" {
  interface SessionData {
    passport?: any;
  }
  
  // Add SessionStore type to the module
  interface Store {
    all: (callback: (err: any, sessions?: Record<string, any>) => void) => void;
    destroy: (sid: string, callback?: (err?: any) => void) => void;
    clear: (callback?: (err?: any) => void) => void;
    length: (callback: (err: any, length?: number) => void) => void;
    get: (sid: string, callback: (err: any, session?: SessionData | null) => void) => void;
    set: (sid: string, session: SessionData, callback?: (err?: any) => void) => void;
    touch: (sid: string, session: SessionData, callback?: (err?: any) => void) => void;
  }
  
  // Define SessionStore type
  type SessionStore = Store;
}

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByMRN(mrn: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;
  
  // Assessment methods
  createWoundAssessment(assessment: InsertWoundAssessment): Promise<WoundAssessment>;
  getWoundAssessment(id: number): Promise<WoundAssessment | undefined>;
  getPatientWoundAssessments(patientId: number): Promise<WoundAssessment[]>;
  getAllWoundAssessments(): Promise<WoundAssessment[]>;
  getRecentWoundAssessments(limit: number): Promise<(WoundAssessment & { patientName: string, patientMRN: string })[]>;
  updateWoundAssessmentStatus(id: number, status: string): Promise<WoundAssessment | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private woundAssessments: Map<number, WoundAssessment>;
  private userId: number;
  private patientId: number;
  private assessmentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.woundAssessments = new Map();
    this.userId = 1;
    this.patientId = 1;
    this.assessmentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create a default user with a plain text password for development
    this.createUser({
      username: "admin",
      password: "password",
      fullName: "Dr. Sarah Ahmed",
      role: "Wound Care Specialist"
    });
    
    // Create some sample patients
    this.createPatient({
      mrn: "MRN-5632147",
      name: "Ahmad Al-Farsi",
      age: 63,
      gender: "Male"
    });
    
    this.createPatient({
      mrn: "MRN-7825401",
      name: "Fatima Mohammad",
      age: 57,
      gender: "Female"
    });
    
    this.createPatient({
      mrn: "MRN-9012456",
      name: "Yusuf Al-Qasimi",
      age: 45,
      gender: "Male"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "Wound Care Specialist" // Ensure role is always provided
    };
    this.users.set(id, user);
    return user;
  }
  
  // Patient methods
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }
  
  async getPatientByMRN(mrn: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.mrn.toLowerCase() === mrn.toLowerCase()
    );
  }
  
  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }
  
  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }
  
  // Assessment methods
  async createWoundAssessment(insertAssessment: InsertWoundAssessment): Promise<WoundAssessment> {
    const id = this.assessmentId++;
    const assessment: WoundAssessment = { 
      ...insertAssessment, 
      id,
      assessmentDate: insertAssessment.assessmentDate || new Date(),
      status: insertAssessment.status || "active"
    };
    this.woundAssessments.set(id, assessment);
    return assessment;
  }
  
  async getWoundAssessment(id: number): Promise<WoundAssessment | undefined> {
    return this.woundAssessments.get(id);
  }
  
  async getPatientWoundAssessments(patientId: number): Promise<WoundAssessment[]> {
    return Array.from(this.woundAssessments.values())
      .filter(assessment => assessment.patientId === patientId)
      .sort((a, b) => {
        const dateA = new Date(a.assessmentDate).getTime();
        const dateB = new Date(b.assessmentDate).getTime();
        return dateB - dateA; // Sort by most recent first
      });
  }
  
  async getAllWoundAssessments(): Promise<WoundAssessment[]> {
    return Array.from(this.woundAssessments.values())
      .sort((a, b) => {
        const dateA = new Date(a.assessmentDate).getTime();
        const dateB = new Date(b.assessmentDate).getTime();
        return dateB - dateA; // Sort by most recent first
      });
  }
  
  async getRecentWoundAssessments(limit: number): Promise<(WoundAssessment & { patientName: string, patientMRN: string })[]> {
    const assessments = Array.from(this.woundAssessments.values())
      .sort((a, b) => {
        const dateA = new Date(a.assessmentDate).getTime();
        const dateB = new Date(b.assessmentDate).getTime();
        return dateB - dateA; // Sort by most recent first
      })
      .slice(0, limit);
    
    return Promise.all(assessments.map(async (assessment) => {
      const patient = await this.getPatient(assessment.patientId);
      return {
        ...assessment,
        patientName: patient?.name || "Unknown",
        patientMRN: patient?.mrn || "Unknown"
      };
    }));
  }
  
  async updateWoundAssessmentStatus(id: number, status: string): Promise<WoundAssessment | undefined> {
    const assessment = this.woundAssessments.get(id);
    if (!assessment) return undefined;
    
    const updatedAssessment = { ...assessment, status };
    this.woundAssessments.set(id, updatedAssessment);
    
    return updatedAssessment;
  }
}

export const storage = new MemStorage();
