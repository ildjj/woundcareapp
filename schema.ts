import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("Wound Care Specialist"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  mrn: text("mrn").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  mrn: true,
  name: true,
  age: true,
  gender: true,
});

export const woundAssessments = pgTable("wound_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  assessmentDate: timestamp("assessment_date").notNull().defaultNow(),
  woundType: text("wound_type").notNull(),
  woundStage: text("wound_stage").notNull(),
  woundLocation: text("wound_location").notNull(),
  woundSide: text("wound_side"),
  woundOnsetDate: timestamp("wound_onset_date"),
  length: real("length").notNull(),
  width: real("width").notNull(),
  depth: real("depth").notNull(),
  area: real("area").notNull(),
  underminingSize: real("undermining_size"),
  underminingLocation: text("undermining_location"),
  tunnelingSize: real("tunneling_size"),
  tunnelingLocation: text("tunneling_location"),
  necroticTissue: integer("necrotic_tissue").default(0),
  sloughTissue: integer("slough_tissue").default(0),
  granulationTissue: integer("granulation_tissue").default(0),
  epithelializationTissue: integer("epithelialization_tissue").default(0),
  woundEdge: jsonb("wound_edge").notNull(),
  periWound: jsonb("peri_wound").notNull(),
  exudateLevel: text("exudate_level"),
  exudateType: text("exudate_type"),
  painScale: integer("pain_scale").default(0),
  nerdsAssessment: jsonb("nerds_assessment").notNull(),
  stoneesAssessment: jsonb("stonees_assessment").notNull(),
  dressingType: text("dressing_type"),
  secondaryDressing: text("secondary_dressing"),
  npwtRequired: boolean("npwt_required").default(false),
  npwtSettings: jsonb("npwt_settings"),
  offloadingRequired: boolean("offloading_required").default(false),
  offloadingMethod: jsonb("offloading_method"),
  woundImages: jsonb("wound_images"), // Added for wound images
  reviewDate: timestamp("review_date"), // When the wound should be reassessed
  additionalNotes: text("additional_notes"),
  status: text("status").notNull().default("active"),
  createdBy: integer("created_by").notNull(),
});

export const woundEdgeSchema = z.object({
  attached: z.boolean().default(false),
  undermining: z.boolean().default(false),
  macerated: z.boolean().default(false),
  rolled: z.boolean().default(false),
});

export const periWoundSchema = z.object({
  maceration: z.boolean().default(false),
  healthy: z.boolean().default(false),
  cellulitis: z.boolean().default(false),
  rash: z.boolean().default(false),
});

export const nerdsSchema = z.object({
  nonHealing: z.boolean().default(false),
  exudateIncreased: z.boolean().default(false),
  redBleeding: z.boolean().default(false),
  debris: z.boolean().default(false),
  smell: z.boolean().default(false),
});

export const stoneesSchema = z.object({
  sizeIncreasing: z.boolean().default(false),
  temperatureIncreased: z.boolean().default(false),
  osExposed: z.boolean().default(false),
  newAreas: z.boolean().default(false),
  exudateIncreasing: z.boolean().default(false),
  erythemaEdema: z.boolean().default(false),
  smell: z.boolean().default(false),
});

export const npwtSettingsSchema = z.object({
  pressure: z.string(),
  therapyMode: z.string(),
  foamType: z.string(),
});

export const offloadingMethodSchema = z.object({
  method: z.string(),
  notes: z.string().optional(),
});

export const woundImageSchema = z.object({
  url: z.string(),
  dateUploaded: z.date().optional().default(() => new Date()),
  description: z.string().optional(),
});

export const insertWoundAssessmentSchema = createInsertSchema(woundAssessments)
  .omit({ id: true })
  .extend({
    woundEdge: woundEdgeSchema,
    periWound: periWoundSchema,
    nerdsAssessment: nerdsSchema,
    stoneesAssessment: stoneesSchema,
    npwtSettings: npwtSettingsSchema.optional(),
    offloadingMethod: offloadingMethodSchema.optional(),
    woundImages: z.array(woundImageSchema).optional(),
    reviewDate: z.date().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertWoundAssessment = z.infer<typeof insertWoundAssessmentSchema>;
export type WoundAssessment = typeof woundAssessments.$inferSelect;

export type WoundEdge = z.infer<typeof woundEdgeSchema>;
export type PeriWound = z.infer<typeof periWoundSchema>;
export type NERDSAssessment = z.infer<typeof nerdsSchema>;
export type STONEESAssessment = z.infer<typeof stoneesSchema>;
export type NPWTSettings = z.infer<typeof npwtSettingsSchema>;
export type OffloadingMethod = z.infer<typeof offloadingMethodSchema>;
export type WoundImage = z.infer<typeof woundImageSchema>;
