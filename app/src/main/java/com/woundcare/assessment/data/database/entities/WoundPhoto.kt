package com.woundcare.assessment.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo
import androidx.room.ForeignKey
import org.threeten.bp.LocalDateTime

@Entity(
    tableName = "wound_photos",
    foreignKeys = [
        ForeignKey(
            entity = Wound::class,
            parentColumns = ["wound_id"],
            childColumns = ["wound_id"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = BWATAssessment::class,
            parentColumns = ["assessment_id"],
            childColumns = ["assessment_id"],
            onDelete = ForeignKey.SET_NULL
        )
    ]
)
data class WoundPhoto(
    @PrimaryKey
    @ColumnInfo(name = "photo_id")
    val photoId: String,
    
    @ColumnInfo(name = "wound_id")
    val woundId: String,
    
    @ColumnInfo(name = "assessment_id")
    val assessmentId: String?,
    
    @ColumnInfo(name = "file_path")
    val filePath: String, // Encrypted file path
    
    @ColumnInfo(name = "file_name")
    val fileName: String,
    
    @ColumnInfo(name = "encrypted_file_path")
    val encryptedFilePath: String, // Actual encrypted storage path
    
    @ColumnInfo(name = "photo_type")
    val photoType: String, // Overview, Close-up, Measurement, Before-Treatment, After-Treatment
    
    @ColumnInfo(name = "photo_angle")
    val photoAngle: String?, // Anterior, Posterior, Lateral, Superior, Inferior
    
    @ColumnInfo(name = "distance_cm")
    val distanceCm: Float?, // Distance from wound when photo was taken
    
    @ColumnInfo(name = "lighting_conditions")
    val lightingConditions: String?, // Natural, Artificial, Flash, Poor
    
    @ColumnInfo(name = "image_quality")
    val imageQuality: String, // Excellent, Good, Fair, Poor
    
    @ColumnInfo(name = "ruler_present")
    val rulerPresent: Boolean = false,
    
    @ColumnInfo(name = "ruler_type")
    val rulerType: String?, // Disposable, Reusable, Digital
    
    @ColumnInfo(name = "measurement_reference")
    val measurementReference: String?, // What was used for scale reference
    
    @ColumnInfo(name = "pixel_per_cm")
    val pixelPerCm: Float?, // Calibration for digital measurements
    
    @ColumnInfo(name = "image_width")
    val imageWidth: Int,
    
    @ColumnInfo(name = "image_height")
    val imageHeight: Int,
    
    @ColumnInfo(name = "file_size_bytes")
    val fileSizeBytes: Long,
    
    @ColumnInfo(name = "compression_ratio")
    val compressionRatio: Float?,
    
    @ColumnInfo(name = "taken_date")
    val takenDate: LocalDateTime,
    
    @ColumnInfo(name = "photographer_name")
    val photographerName: String,
    
    @ColumnInfo(name = "photographer_credentials")
    val photographerCredentials: String?,
    
    @ColumnInfo(name = "camera_make")
    val cameraMake: String?,
    
    @ColumnInfo(name = "camera_model")
    val cameraModel: String?,
    
    @ColumnInfo(name = "camera_settings")
    val cameraSettings: String?, // JSON with ISO, aperture, shutter speed
    
    @ColumnInfo(name = "flash_used")
    val flashUsed: Boolean = false,
    
    @ColumnInfo(name = "wound_measurements")
    val woundMeasurements: String?, // JSON with measurements taken from this photo
    
    @ColumnInfo(name = "ai_analysis_status")
    val aiAnalysisStatus: String, // Pending, Processing, Completed, Failed
    
    @ColumnInfo(name = "ai_confidence_score")
    val aiConfidenceScore: Float?,
    
    @ColumnInfo(name = "ai_wound_type_prediction")
    val aiWoundTypePrediction: String?,
    
    @ColumnInfo(name = "ai_healing_stage_prediction")
    val aiHealingStagePrediction: String?,
    
    @ColumnInfo(name = "ai_area_calculation_cm2")
    val aiAreaCalculationCm2: Float?,
    
    @ColumnInfo(name = "ai_volume_estimation_cm3")
    val aiVolumeEstimationCm3: Float?,
    
    @ColumnInfo(name = "ai_tissue_analysis")
    val aiTissueAnalysis: String?, // JSON with tissue type percentages
    
    @ColumnInfo(name = "ai_infection_risk_score")
    val aiInfectionRiskScore: Float?,
    
    @ColumnInfo(name = "ai_healing_prediction")
    val aiHealingPrediction: String?, // JSON with healing timeline prediction
    
    @ColumnInfo(name = "ai_recommendations")
    val aiRecommendations: String?, // JSON with AI treatment recommendations
    
    @ColumnInfo(name = "manual_annotations")
    val manualAnnotations: String?, // JSON with user-drawn annotations
    
    @ColumnInfo(name = "measurement_points")
    val measurementPoints: String?, // JSON with manually placed measurement points
    
    @ColumnInfo(name = "comparison_baseline")
    val comparisonBaseline: Boolean = false, // Is this the baseline photo for comparisons?
    
    @ColumnInfo(name = "comparison_previous_photo_id")
    val comparisonPreviousPhotoId: String?, // For progress comparison
    
    @ColumnInfo(name = "privacy_level")
    val privacyLevel: String, // High, Medium, Low (affects sharing and export)
    
    @ColumnInfo(name = "consent_verified")
    val consentVerified: Boolean = false,
    
    @ColumnInfo(name = "exported_for_research")
    val exportedForResearch: Boolean = false,
    
    @ColumnInfo(name = "shared_with_physician")
    val sharedWithPhysician: Boolean = false,
    
    @ColumnInfo(name = "backup_status")
    val backupStatus: String, // None, Pending, Completed, Failed
    
    @ColumnInfo(name = "backup_date")
    val backupDate: LocalDateTime?,
    
    @ColumnInfo(name = "hash_checksum")
    val hashChecksum: String, // For file integrity verification
    
    @ColumnInfo(name = "metadata")
    val metadata: String?, // Additional JSON metadata
    
    @ColumnInfo(name = "notes")
    val notes: String?,
    
    @ColumnInfo(name = "created_at")
    val createdAt: LocalDateTime,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: LocalDateTime,
    
    @ColumnInfo(name = "is_deleted")
    val isDeleted: Boolean = false,
    
    @ColumnInfo(name = "deleted_date")
    val deletedDate: LocalDateTime?
) {
    
    fun getDisplayName(): String {
        val date = takenDate.toLocalDate().toString()
        return "$photoType - $date"
    }
    
    fun isHighQuality(): Boolean = imageQuality in listOf("Excellent", "Good")
    
    fun canBeUsedForMeasurement(): Boolean {
        return rulerPresent && 
               isHighQuality() && 
               pixelPerCm != null && 
               pixelPerCm > 0
    }
    
    fun hasAiAnalysis(): Boolean = aiAnalysisStatus == "Completed"
    
    fun isBaselinePhoto(): Boolean = comparisonBaseline
    
    fun requiresConsent(): Boolean = !consentVerified && privacyLevel == "High"
    
    fun getFileSizeMB(): Float = fileSizeBytes / (1024f * 1024f)
    
    fun isValidForClinicalUse(): Boolean {
        return consentVerified &&
               isHighQuality() &&
               !isDeleted &&
               hashChecksum.isNotEmpty()
    }
    
    fun canBeShared(): Boolean {
        return consentVerified && 
               privacyLevel != "High" && 
               !isDeleted &&
               isValidForClinicalUse()
    }
    
    companion object {
        const val MAX_FILE_SIZE_MB = 50f
        const val MIN_RESOLUTION_WIDTH = 800
        const val MIN_RESOLUTION_HEIGHT = 600
        
        fun validateImageSpecs(width: Int, height: Int, sizeBytes: Long): Boolean {
            val sizeMB = sizeBytes / (1024f * 1024f)
            return width >= MIN_RESOLUTION_WIDTH &&
                   height >= MIN_RESOLUTION_HEIGHT &&
                   sizeMB <= MAX_FILE_SIZE_MB
        }
    }
}