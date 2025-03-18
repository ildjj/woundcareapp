
import PDFDocument from 'pdfkit';
import type { Patient, WoundAssessment } from '@shared/schema';
import { format } from 'date-fns';

export async function generatePatientReport(patient: Patient, assessments: WoundAssessment[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Add content to PDF
    doc.fontSize(20).text('Patient Wound Care Report', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(16).text('Patient Information');
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Name: ${patient.name}`);
    doc.text(`MRN: ${patient.mrn}`);
    doc.text(`Age: ${patient.age}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.moveDown();

    // Assessment History
    doc.fontSize(16).text('Wound Assessment History');
    doc.moveDown(0.5);

    assessments.forEach((assessment) => {
      doc.fontSize(12).text(`Date: ${format(new Date(assessment.assessmentDate), 'MMM d, yyyy')}`);
      doc.text(`Size: ${assessment.length}cm x ${assessment.width}cm x ${assessment.depth}cm`);
      doc.text(`Stage: ${assessment.woundStage}`);
      doc.text(`Status: ${assessment.status}`);
      doc.text(`Granulation: ${assessment.granulationTissue}%`);
      doc.text(`Exudate Level: ${assessment.exudateLevel}`);
      doc.text(`Pain Scale: ${assessment.painScale}/10`);
      doc.text(`Treatment: ${assessment.dressingType}`);
      doc.moveDown();
    });

    doc.end();
  });
}
import PDFDocument from 'pdfkit';
import type { Patient, WoundAssessment } from '@shared/schema';

export async function generatePatientReport(patient: Patient, assessments: WoundAssessment[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(20).text('Patient Wound Care Report', { align: 'center' });
    doc.moveDown();

    // Patient Information
    doc.fontSize(16).text('Patient Information');
    doc.fontSize(12);
    doc.text(`Name: ${patient.name}`);
    doc.text(`MRN: ${patient.mrn}`);
    doc.text(`Age: ${patient.age}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.moveDown();

    // Assessment Summary
    doc.fontSize(16).text('Wound Assessment History');
    doc.moveDown();

    assessments.forEach((assessment, index) => {
      doc.fontSize(12).text(`Assessment #${index + 1} - ${new Date(assessment.assessmentDate).toLocaleDateString()}`);
      doc.text(`Location: ${assessment.woundLocation}`);
      doc.text(`Size: ${assessment.length}cm x ${assessment.width}cm`);
      doc.text(`Status: ${assessment.status}`);
      doc.moveDown();
    });

    doc.end();
  });
}
