package com.woundcare.tracker.models

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import java.util.Date

@Entity(
    tableName = "assessments",
    foreignKeys = [
        ForeignKey(
            entity = Wound::class,
            parentColumns = ["id"],
            childColumns = ["woundId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Assessment(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val woundId: Long,
    val assessmentType: String, // BWAT, MEASURE, General
    val assessmentDate: Date = Date(),
    val assessorName: String,
    
    // Measurements
    val length: Double? = null,
    val width: Double? = null,
    val depth: Double? = null,
    val area: Double? = null,
    val volume: Double? = null,
    
    // BWAT specific fields (scores 1-5 for each item)
    val bwatSize: Int? = null,
    val bwatDepth: Int? = null,
    val bwatEdges: Int? = null,
    val bwatUndermining: Int? = null,
    val bwatNecroticTissueType: Int? = null,
    val bwatNecroticTissueAmount: Int? = null,
    val bwatExudateType: Int? = null,
    val bwatExudateAmount: Int? = null,
    val bwatSkinColorSurrounding: Int? = null,
    val bwatPeripheralTissueEdema: Int? = null,
    val bwatPeripheralTissueInduration: Int? = null,
    val bwatGranulationTissue: Int? = null,
    val bwatEpithelialization: Int? = null,
    val bwatTotalScore: Int? = null,
    
    // General assessment fields
    val woundBedAppearance: String? = null,
    val exudateAmount: String? = null,
    val exudateType: String? = null,
    val odor: String? = null,
    val periWoundCondition: String? = null,
    val pain: Int? = null,
    val signsOfInfection: Boolean = false,
    val treatmentPlan: String? = null,
    val dressingType: String? = null,
    val notes: String? = null,
    
    // Photo documentation
    val photoCount: Int = 0,
    
    // AI Analysis results
    val aiAnalysisPerformed: Boolean = false,
    val aiWoundTypeDetected: String? = null,
    val aiSeverityScore: Double? = null,
    val aiHealingProgress: String? = null,
    val aiRecommendations: String? = null,
    
    val createdAt: Date = Date()
)