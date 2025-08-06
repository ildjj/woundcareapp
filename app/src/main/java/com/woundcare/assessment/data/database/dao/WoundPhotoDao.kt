package com.woundcare.assessment.data.database.dao

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import com.woundcare.assessment.data.database.entities.WoundPhoto
import org.threeten.bp.LocalDateTime

@Dao
interface WoundPhotoDao {
    
    @Query("SELECT * FROM wound_photos WHERE is_deleted = 0 ORDER BY taken_date DESC")
    fun getAllActivePhotos(): Flow<List<WoundPhoto>>
    
    @Query("SELECT * FROM wound_photos WHERE wound_id = :woundId AND is_deleted = 0 ORDER BY taken_date DESC")
    fun getPhotosByWound(woundId: String): Flow<List<WoundPhoto>>
    
    @Query("SELECT * FROM wound_photos WHERE wound_id = :woundId AND is_deleted = 0 ORDER BY taken_date DESC")
    suspend fun getPhotosByWoundSync(woundId: String): List<WoundPhoto>
    
    @Query("SELECT * FROM wound_photos WHERE assessment_id = :assessmentId AND is_deleted = 0 ORDER BY taken_date")
    fun getPhotosByAssessment(assessmentId: String): Flow<List<WoundPhoto>>
    
    @Query("SELECT * FROM wound_photos WHERE assessment_id = :assessmentId AND is_deleted = 0 ORDER BY taken_date")
    suspend fun getPhotosByAssessmentSync(assessmentId: String): List<WoundPhoto>
    
    @Query("SELECT * FROM wound_photos WHERE photo_id = :photoId")
    suspend fun getPhotoById(photoId: String): WoundPhoto?
    
    @Query("SELECT * FROM wound_photos WHERE photo_id = :photoId")
    fun getPhotoByIdFlow(photoId: String): Flow<WoundPhoto?>
    
    @Query("SELECT * FROM wound_photos WHERE photo_type = :type AND is_deleted = 0 ORDER BY taken_date DESC")
    suspend fun getPhotosByType(type: String): List<WoundPhoto>
    
    @Query("SELECT * FROM wound_photos WHERE image_quality = :quality AND is_deleted = 0 ORDER BY taken_date DESC")
    suspend fun getPhotosByQuality(quality: String): List<WoundPhoto>
    
    @Query("SELECT * FROM wound_photos WHERE ai_analysis_status = :status AND is_deleted = 0 ORDER BY taken_date DESC")
    suspend fun getPhotosByAIStatus(status: String): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE taken_date >= :startDate 
        AND taken_date <= :endDate 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE photographer_name = :photographerName 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosByPhotographer(photographerName: String): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE ruler_present = 1 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosWithRuler(): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE pixel_per_cm IS NOT NULL 
        AND pixel_per_cm > 0 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosWithCalibration(): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE comparison_baseline = 1 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getBaselinePhotos(): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE wound_id = :woundId 
        AND comparison_baseline = 1 
        AND is_deleted = 0
        ORDER BY taken_date 
        LIMIT 1
    """)
    suspend fun getBaselinePhotoForWound(woundId: String): WoundPhoto?
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE consent_verified = 0 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosWithoutConsent(): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE privacy_level = :level 
        AND is_deleted = 0
        ORDER BY taken_date DESC
    """)
    suspend fun getPhotosByPrivacyLevel(level: String): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE ai_analysis_status = 'Completed' 
        AND ai_confidence_score >= :minConfidence 
        AND is_deleted = 0
        ORDER BY ai_confidence_score DESC
    """)
    suspend fun getPhotosWithHighAIConfidence(minConfidence: Float): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE ai_infection_risk_score >= :minRisk 
        AND is_deleted = 0
        ORDER BY ai_infection_risk_score DESC
    """)
    suspend fun getPhotosWithHighInfectionRisk(minRisk: Float): List<WoundPhoto>
    
    @Query("""
        SELECT * FROM wound_photos 
        WHERE backup_status != 'Completed' 
        AND is_deleted = 0
        ORDER BY taken_date
    """)
    suspend fun getPhotosNeedingBackup(): List<WoundPhoto>
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE wound_id = :woundId AND is_deleted = 0")
    suspend fun getPhotoCountForWound(woundId: String): Int
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE assessment_id = :assessmentId AND is_deleted = 0")
    suspend fun getPhotoCountForAssessment(assessmentId: String): Int
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE is_deleted = 0")
    suspend fun getTotalPhotoCount(): Int
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE is_deleted = 0")
    fun getTotalPhotoCountFlow(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE photo_type = :type AND is_deleted = 0")
    suspend fun getPhotoCountByType(type: String): Int
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE ai_analysis_status = 'Completed' AND is_deleted = 0")
    suspend fun getAIAnalyzedPhotoCount(): Int
    
    @Query("SELECT SUM(file_size_bytes) FROM wound_photos WHERE is_deleted = 0")
    suspend fun getTotalStorageUsed(): Long?
    
    @Query("SELECT AVG(file_size_bytes) FROM wound_photos WHERE is_deleted = 0")
    suspend fun getAverageFileSize(): Float?
    
    @Query("SELECT DISTINCT photo_type FROM wound_photos WHERE is_deleted = 0")
    suspend fun getDistinctPhotoTypes(): List<String>
    
    @Query("SELECT DISTINCT image_quality FROM wound_photos WHERE is_deleted = 0")
    suspend fun getDistinctImageQualities(): List<String>
    
    @Query("SELECT DISTINCT photographer_name FROM wound_photos WHERE is_deleted = 0")
    suspend fun getDistinctPhotographers(): List<String>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPhoto(photo: WoundPhoto): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPhotos(photos: List<WoundPhoto>): List<Long>
    
    @Update
    suspend fun updatePhoto(photo: WoundPhoto): Int
    
    @Query("""
        UPDATE wound_photos 
        SET updated_at = :updatedAt 
        WHERE photo_id = :photoId
    """)
    suspend fun updatePhotoTimestamp(photoId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET ai_analysis_status = :status,
            ai_confidence_score = :confidenceScore,
            ai_wound_type_prediction = :woundTypePrediction,
            ai_healing_stage_prediction = :healingStagePrediction,
            ai_area_calculation_cm2 = :areaCalculation,
            ai_volume_estimation_cm3 = :volumeEstimation,
            ai_tissue_analysis = :tissueAnalysis,
            ai_infection_risk_score = :infectionRiskScore,
            ai_healing_prediction = :healingPrediction,
            ai_recommendations = :recommendations,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateAIAnalysis(
        photoId: String,
        status: String,
        confidenceScore: Float?,
        woundTypePrediction: String?,
        healingStagePrediction: String?,
        areaCalculation: Float?,
        volumeEstimation: Float?,
        tissueAnalysis: String?,
        infectionRiskScore: Float?,
        healingPrediction: String?,
        recommendations: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wound_photos 
        SET consent_verified = :verified,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateConsentStatus(photoId: String, verified: Boolean, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET privacy_level = :level,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updatePrivacyLevel(photoId: String, level: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET backup_status = :status,
            backup_date = :backupDate,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateBackupStatus(
        photoId: String,
        status: String,
        backupDate: LocalDateTime?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wound_photos 
        SET comparison_baseline = :isBaseline,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateBaselineStatus(photoId: String, isBaseline: Boolean, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET manual_annotations = :annotations,
            measurement_points = :measurementPoints,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateAnnotations(
        photoId: String,
        annotations: String?,
        measurementPoints: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wound_photos 
        SET shared_with_physician = :shared,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun updateSharingStatus(photoId: String, shared: Boolean, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET is_deleted = 1,
            deleted_date = :deletedDate,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun markPhotoAsDeleted(photoId: String, deletedDate: LocalDateTime, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wound_photos 
        SET is_deleted = 0,
            deleted_date = NULL,
            updated_at = :updatedAt
        WHERE photo_id = :photoId
    """)
    suspend fun restorePhoto(photoId: String, updatedAt: LocalDateTime): Int
    
    @Delete
    suspend fun deletePhoto(photo: WoundPhoto): Int
    
    @Query("DELETE FROM wound_photos WHERE photo_id = :photoId")
    suspend fun deletePhotoById(photoId: String): Int
    
    @Query("DELETE FROM wound_photos WHERE wound_id = :woundId")
    suspend fun deletePhotosByWound(woundId: String): Int
    
    @Query("DELETE FROM wound_photos WHERE assessment_id = :assessmentId")
    suspend fun deletePhotosByAssessment(assessmentId: String): Int
    
    @Query("DELETE FROM wound_photos WHERE is_deleted = 1 AND deleted_date < :cutoffDate")
    suspend fun permanentlyDeleteOldPhotos(cutoffDate: LocalDateTime): Int
    
    @Transaction
    suspend fun insertOrUpdatePhoto(photo: WoundPhoto): WoundPhoto {
        val existing = getPhotoById(photo.photoId)
        return if (existing != null) {
            updatePhoto(photo.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            ))
            photo.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            )
        } else {
            insertPhoto(photo)
            photo
        }
    }
    
    @Transaction
    suspend fun getPhotoProgressionForWound(woundId: String): List<WoundPhoto> {
        return getPhotosByWoundSync(woundId).sortedBy { it.takenDate }
    }
    
    @Transaction
    suspend fun setNewBaselinePhoto(woundId: String, newBaselinePhotoId: String): Boolean {
        return try {
            val currentTime = LocalDateTime.now()
            
            // First, remove baseline status from all other photos for this wound
            val allPhotos = getPhotosByWoundSync(woundId)
            for (photo in allPhotos) {
                if (photo.comparisonBaseline) {
                    updateBaselineStatus(photo.photoId, false, currentTime)
                }
            }
            
            // Then set the new baseline
            updateBaselineStatus(newBaselinePhotoId, true, currentTime)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    @Transaction
    suspend fun bulkUpdatePhotoStatuses(photoIds: List<String>, isDeleted: Boolean): Int {
        val updatedAt = LocalDateTime.now()
        val deletedDate = if (isDeleted) updatedAt else null
        var totalUpdated = 0
        
        for (photoId in photoIds) {
            if (isDeleted) {
                totalUpdated += markPhotoAsDeleted(photoId, updatedAt, updatedAt)
            } else {
                totalUpdated += restorePhoto(photoId, updatedAt)
            }
        }
        return totalUpdated
    }
    
    @Transaction
    suspend fun getPhotosForComparison(woundId: String, baselinePhotoId: String): List<WoundPhoto> {
        val baselinePhoto = getPhotoById(baselinePhotoId)
        val allPhotos = getPhotosByWoundSync(woundId)
        
        return if (baselinePhoto != null) {
            allPhotos.filter { 
                it.photoId != baselinePhotoId && 
                it.takenDate.isAfter(baselinePhoto.takenDate) 
            }.sortedBy { it.takenDate }
        } else {
            emptyList()
        }
    }
}