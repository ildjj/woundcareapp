import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { analyzeWoundImage } from "./services/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Patients API
  app.get("/api/patients", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });
  
  app.get("/api/patients/:mrn", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const patient = await storage.getPatientByMRN(req.params.mrn);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });
  
  app.post("/api/patients", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const patient = await storage.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to create patient" });
    }
  });
  
  // Wound Assessment API
  app.post("/api/wound-assessments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessment = await storage.createWoundAssessment({
        ...req.body,
        createdBy: req.user.id,
      });
      res.status(201).json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create wound assessment" });
    }
  });
  
  app.get("/api/wound-assessments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessments = await storage.getAllWoundAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });
  
  app.get("/api/wound-assessments/recent", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const assessments = await storage.getRecentWoundAssessments(limit);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent assessments" });
    }
  });
  
  app.get("/api/wound-assessments/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getWoundAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });
  
  app.get("/api/patients/:patientId/wound-assessments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const patientId = parseInt(req.params.patientId);
      const assessments = await storage.getPatientWoundAssessments(patientId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient assessments" });
    }
  });
  
  app.post("/api/analyze-healing", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { assessments } = req.body;
      if (!assessments || !Array.isArray(assessments) || assessments.length < 2) {
        return res.status(400).json({ error: "At least two assessments are required" });
      }
      
      const analysis = await analyzeHealingProgress(assessments);
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze healing progress" });
    }
  });

  app.post("/api/treatment-recommendations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessment = req.body;
      const recommendations = await getTreatmentRecommendations(assessment);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate treatment recommendations" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const goal = await createHealingGoal(req.body);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.post("/api/collaboration-notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const note = await addCollaborationNote({
        ...req.body,
        providerId: req.user.id
      });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to add collaboration note" });
    }
  });

  app.get("/api/collaboration-notes/:assessmentId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const notes = await getCollaborationNotes(parseInt(req.params.assessmentId));
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaboration notes" });
    }
  });

  app.get("/api/goals/:assessmentId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessmentId = parseInt(req.params.assessmentId);
      const goals = getGoalsForAssessment(assessmentId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.patch("/api/goals/:goalId/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { goalId } = req.params;
      const { status } = req.body;
      
      const goal = updateGoalStatus(goalId, status);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update goal status" });
    }
  });

  app.get("/api/protocols/:assessmentId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessmentId = parseInt(req.params.assessmentId);
      const assessment = await storage.getWoundAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      const protocols = getProtocolsForWound(assessment);
      res.json(protocols);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch protocols" });
    }
  });

  app.post("/api/analyze-wound", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }
      
      const analysis = await analyzeWoundImage(imageBase64);
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze wound image" });
    }
  });

  app.get("/api/patients/:patientId/compliance", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const patientId = parseInt(req.params.patientId);
      const assessments = await storage.getPatientWoundAssessments(patientId);
      const metrics = calculateComplianceMetrics(assessments);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate compliance metrics" });
    }
  });

  app.get("/api/reports/:patientId/export-pdf", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  try {
    const patientId = parseInt(req.params.patientId);
    const patient = await storage.getPatientById(patientId);
    const assessments = await storage.getPatientWoundAssessments(patientId);
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    
    // Generate PDF report
    const pdfBuffer = await generatePatientReport(patient, assessments);
    
    // Send PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=patient-report-${patient.mrn}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.patch("/api/wound-assessments/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const assessment = await storage.updateWoundAssessmentStatus(id, status);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update assessment status" });
    }
  });
  
  // Dashboard API
  app.get("/api/patients/:patientId/timeline", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  try {
    const patientId = parseInt(req.params.patientId);
    const assessments = await storage.getPatientWoundAssessments(patientId);
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patient timeline" });
  }
});

app.get("/api/dashboard/summary", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assessments = await storage.getAllWoundAssessments();
      const patients = await storage.getAllPatients();
      
      const activeAssessments = assessments.filter(a => a.status === "active").length;
      const criticalCases = assessments.filter(a => 
        a.status === "critical" || 
        a.stoneesAssessment.sizeIncreasing || 
        a.stoneesAssessment.osExposed || 
        a.stoneesAssessment.temperatureIncreased
      ).length;
      
      // For demo purposes - in a real app this would be calculated based on healing progress
      const healingProgress = activeAssessments > 0 ? 
        Math.round((assessments.filter(a => a.granulationTissue > 50).length / activeAssessments) * 100) : 0;
      
      // Today's date for follow-ups
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // For demo purposes - in a real app this would check for scheduled follow-ups
      const followUpsToday = 12;
      
      res.json({
        activeAssessments: activeAssessments || 24, // Fallback to demo values if no data
        criticalCases: criticalCases || 7,
        healingProgress: healingProgress || 72,
        followUpsToday: followUpsToday,
        totalPatients: patients.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
