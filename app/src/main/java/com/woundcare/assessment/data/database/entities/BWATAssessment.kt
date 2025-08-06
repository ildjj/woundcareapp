package com.woundcare.assessment.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo
import androidx.room.ForeignKey
import org.threeten.bp.LocalDateTime

@Entity(
    tableName = "bwat_assessments",
    foreignKeys = [
        ForeignKey(
            entity = Wound::class,
            parentColumns = ["wound_id"],
            childColumns = ["wound_id"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class BWATAssessment(
    @PrimaryKey
    @ColumnInfo(name = "assessment_id")
    val assessmentId: String,
    
    @ColumnInfo(name = "wound_id")
    val woundId: String,
    
    @ColumnInfo(name = "assessment_date")
    val assessmentDate: LocalDateTime,
    
    @ColumnInfo(name = "assessor_name")
    val assessorName: String,
    
    @ColumnInfo(name = "assessor_credentials")
    val assessorCredentials: String?,
    
    // BWAT Scoring Items (1-5 scale each)
    @ColumnInfo(name = "size_length")
    val sizeLength: Float, // Actual measurement in cm
    
    @ColumnInfo(name = "size_width")
    val sizeWidth: Float, // Actual measurement in cm
    
    @ColumnInfo(name = "size_depth")
    val sizeDepth: Float?, // Actual measurement in cm
    
    @ColumnInfo(name = "size_score")
    val sizeScore: Int, // 1-5 based on wound area
    
    @ColumnInfo(name = "depth_score")
    val depthScore: Int, // 1-5 (1=Non-blanchable erythema, 5=Full thickness with bone/tendon)
    
    @ColumnInfo(name = "edges_score")
    val edgesScore: Int, // 1-5 (1=Distinct/clear, 5=Not visible)
    
    @ColumnInfo(name = "undermining_score")
    val underminingScore: Int, // 1-5 (1=None, 5=>2cm any direction)
    
    @ColumnInfo(name = "necrotic_tissue_type_score")
    val necroticTissueTypeScore: Int, // 1-5 (1=None visible, 5=Thick eschar)
    
    @ColumnInfo(name = "necrotic_tissue_amount_score")
    val necroticTissueAmountScore: Int, // 1-5 (1=None visible, 5=76-100%)
    
    @ColumnInfo(name = "exudate_type_score")
    val exudateTypeScore: Int, // 1-5 (1=None, 5=Purulent)
    
    @ColumnInfo(name = "exudate_amount_score")
    val exudateAmountScore: Int, // 1-5 (1=None, 5=Large amount)
    
    @ColumnInfo(name = "skin_color_score")
    val skinColorScore: Int, // 1-5 (1=Pink/normal, 5=Dark red/purple)
    
    @ColumnInfo(name = "peripheral_tissue_edema_score")
    val peripheralTissueEdemaScore: Int, // 1-5 (1=No swelling, 5=Pitting edema extends >4cm)
    
    @ColumnInfo(name = "peripheral_tissue_induration_score")
    val peripheralTissueIndurationScore: Int, // 1-5 (1=None, 5=Induration >4cm)
    
    @ColumnInfo(name = "granulation_tissue_score")
    val granulationTissueScore: Int, // 1-5 (1=Skin intact, 5=No granulation tissue)
    
    @ColumnInfo(name = "epithelialization_score")
    val epithelializationScore: Int, // 1-5 (1=100% complete, 5=<25% epithelialization)
    
    // Calculated scores
    @ColumnInfo(name = "total_score")
    val totalScore: Int, // Sum of all individual scores
    
    @ColumnInfo(name = "healing_status")
    val healingStatus: String, // Regenerating, Stalled, Degenerating
    
    // Additional measurements
    @ColumnInfo(name = "wound_area_cm2")
    val woundAreaCm2: Float?, // Length × Width
    
    @ColumnInfo(name = "wound_volume_cm3")
    val woundVolumeCm3: Float?, // Length × Width × Depth
    
    @ColumnInfo(name = "tunneling_present")
    val tunnelingPresent: Boolean = false,
    
    @ColumnInfo(name = "tunneling_location")
    val tunnelingLocation: String?, // Clock position description
    
    @ColumnInfo(name = "tunneling_depth_cm")
    val tunnelingDepthCm: Float?,
    
    @ColumnInfo(name = "undermining_present")
    val underminingPresent: Boolean = false,
    
    @ColumnInfo(name = "undermining_location")
    val underminingLocation: String?, // Clock position description
    
    @ColumnInfo(name = "undermining_depth_cm")
    val underminingDepthCm: Float?,
    
    // Clinical observations
    @ColumnInfo(name = "pain_score")
    val painScore: Int?, // 0-10 scale
    
    @ColumnInfo(name = "temperature_elevated")
    val temperatureElevated: Boolean = false,
    
    @ColumnInfo(name = "signs_of_infection")
    val signsOfInfection: String?, // JSON array of infection signs
    
    @ColumnInfo(name = "treatment_response")
    val treatmentResponse: String?, // Improving, Static, Declining
    
    @ColumnInfo(name = "treatment_plan")
    val treatmentPlan: String?,
    
    @ColumnInfo(name = "next_assessment_date")
    val nextAssessmentDate: LocalDateTime?,
    
    @ColumnInfo(name = "clinical_notes")
    val clinicalNotes: String?,
    
    @ColumnInfo(name = "photos_taken")
    val photosTaken: Boolean = false,
    
    @ColumnInfo(name = "photo_count")
    val photoCount: Int = 0,
    
    @ColumnInfo(name = "ai_analysis_completed")
    val aiAnalysisCompleted: Boolean = false,
    
    @ColumnInfo(name = "ai_confidence_score")
    val aiConfidenceScore: Float?,
    
    @ColumnInfo(name = "ai_recommendations")
    val aiRecommendations: String?, // JSON string of AI suggestions
    
    @ColumnInfo(name = "created_at")
    val createdAt: LocalDateTime,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: LocalDateTime
) {
    
    fun getHealingRate(): String {
        return when {
            totalScore <= 20 -> "Excellent"
            totalScore <= 30 -> "Good" 
            totalScore <= 40 -> "Fair"
            totalScore <= 50 -> "Poor"
            else -> "Critical"
        }
    }
    
    fun isWorsening(): Boolean = healingStatus == "Degenerating"
    
    fun isHealing(): Boolean = healingStatus == "Regenerating"
    
    fun isStalled(): Boolean = healingStatus == "Stalled"
    
    fun hasComplications(): Boolean {
        return signsOfInfection?.isNotEmpty() == true ||
               temperatureElevated ||
               painScore?.let { it > 6 } == true ||
               (necroticTissueAmountScore > 3 && necroticTissueTypeScore > 3)
    }
    
    fun calculateWoundVolume(): Float? {
        return if (sizeLength > 0 && sizeWidth > 0 && sizeDepth != null && sizeDepth > 0) {
            sizeLength * sizeWidth * sizeDepth
        } else null
    }
    
    companion object {
        const val MIN_SCORE = 13
        const val MAX_SCORE = 65
        
        fun calculateTotalScore(assessment: BWATAssessment): Int {
            return assessment.sizeScore +
                   assessment.depthScore +
                   assessment.edgesScore +
                   assessment.underminingScore +
                   assessment.necroticTissueTypeScore +
                   assessment.necroticTissueAmountScore +
                   assessment.exudateTypeScore +
                   assessment.exudateAmountScore +
                   assessment.skinColorScore +
                   assessment.peripheralTissueEdemaScore +
                   assessment.peripheralTissueIndurationScore +
                   assessment.granulationTissueScore +
                   assessment.epithelializationScore
        }
    }
}