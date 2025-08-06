package com.woundcare.assessment.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo
import androidx.room.ForeignKey
import org.threeten.bp.LocalDateTime

@Entity(
    tableName = "wounds",
    foreignKeys = [
        ForeignKey(
            entity = Patient::class,
            parentColumns = ["patient_id"],
            childColumns = ["patient_id"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Wound(
    @PrimaryKey
    @ColumnInfo(name = "wound_id")
    val woundId: String,
    
    @ColumnInfo(name = "patient_id")
    val patientId: String,
    
    @ColumnInfo(name = "wound_number")
    val woundNumber: Int, // Sequential number for patient's wounds
    
    @ColumnInfo(name = "anatomical_location")
    val anatomicalLocation: String, // Specific body part
    
    @ColumnInfo(name = "location_details")
    val locationDetails: String?, // Additional location description
    
    @ColumnInfo(name = "wound_type")
    val woundType: String, // Pressure, Diabetic, Venous, Arterial, Surgical, Traumatic
    
    @ColumnInfo(name = "wound_category")
    val woundCategory: String, // Acute, Chronic
    
    @ColumnInfo(name = "cause_of_wound")
    val causeOfWound: String?,
    
    @ColumnInfo(name = "onset_date")
    val onsetDate: LocalDateTime?,
    
    @ColumnInfo(name = "discovery_date")
    val discoveryDate: LocalDateTime,
    
    @ColumnInfo(name = "initial_stage")
    val initialStage: String?, // Stage I-IV for pressure ulcers
    
    @ColumnInfo(name = "current_stage")
    val currentStage: String?,
    
    @ColumnInfo(name = "risk_factors")
    val riskFactors: String?, // JSON array of risk factors
    
    @ColumnInfo(name = "previous_treatments")
    val previousTreatments: String?, // JSON array of previous treatments
    
    @ColumnInfo(name = "treatment_goals")
    val treatmentGoals: String?, // JSON array of treatment goals
    
    @ColumnInfo(name = "expected_healing_time")
    val expectedHealingTimeWeeks: Int?,
    
    @ColumnInfo(name = "complications")
    val complications: String?, // JSON array of complications
    
    @ColumnInfo(name = "infection_signs")
    val infectionSigns: String?, // JSON array of infection indicators
    
    @ColumnInfo(name = "pain_level")
    val painLevel: Int?, // 0-10 scale
    
    @ColumnInfo(name = "drainage_amount")
    val drainageAmount: String?, // None, Minimal, Moderate, Heavy
    
    @ColumnInfo(name = "drainage_type")
    val drainageType: String?, // Serous, Sanguineous, Serosanguineous, Purulent
    
    @ColumnInfo(name = "odor_present")
    val odorPresent: Boolean = false,
    
    @ColumnInfo(name = "surrounding_skin_condition")
    val surroundingSkinCondition: String?, // Intact, Macerated, Dry, Inflamed
    
    @ColumnInfo(name = "wound_edges")
    val woundEdges: String?, // Well-defined, Irregular, Rolled, Undermined
    
    @ColumnInfo(name = "wound_base")
    val woundBase: String?, // Granulation, Slough, Eschar, Bone visible
    
    @ColumnInfo(name = "periwound_skin")
    val periwoundSkin: String?, // Normal, Erythematous, Indurated, Warm
    
    @ColumnInfo(name = "current_dressing")
    val currentDressing: String?,
    
    @ColumnInfo(name = "dressing_change_frequency")
    val dressingChangeFrequency: String?, // Daily, Twice daily, Every other day, etc.
    
    @ColumnInfo(name = "photography_consent")
    val photographyConsent: Boolean = false,
    
    @ColumnInfo(name = "healing_status")
    val healingStatus: String, // Healing, Stalled, Deteriorating, Healed
    
    @ColumnInfo(name = "closure_date")
    val closureDate: LocalDateTime?,
    
    @ColumnInfo(name = "closure_method")
    val closureMethod: String?, // Natural healing, Surgical closure, Skin graft
    
    @ColumnInfo(name = "follow_up_required")
    val followUpRequired: Boolean = true,
    
    @ColumnInfo(name = "next_assessment_date")
    val nextAssessmentDate: LocalDateTime?,
    
    @ColumnInfo(name = "created_at")
    val createdAt: LocalDateTime,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: LocalDateTime,
    
    @ColumnInfo(name = "is_active")
    val isActive: Boolean = true,
    
    @ColumnInfo(name = "clinical_notes")
    val clinicalNotes: String?
) {
    
    fun getDurationInDays(): Long {
        val onset = onsetDate ?: discoveryDate
        val current = LocalDateTime.now()
        return java.time.Duration.between(
            java.time.LocalDateTime.of(onset.year, onset.month, onset.dayOfMonth, onset.hour, onset.minute),
            java.time.LocalDateTime.of(current.year, current.month, current.dayOfMonth, current.hour, current.minute)
        ).toDays()
    }
    
    fun isChronicWound(): Boolean = getDurationInDays() > 30
    
    fun requiresUrgentAttention(): Boolean {
        return infectionSigns?.contains("fever") == true ||
               infectionSigns?.contains("spreading erythema") == true ||
               painLevel?.let { it > 7 } == true ||
               drainageType == "Purulent"
    }
    
    fun getWoundIdentifier(): String = "W$woundNumber"
}