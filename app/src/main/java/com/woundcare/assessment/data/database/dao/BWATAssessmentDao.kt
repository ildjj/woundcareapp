package com.woundcare.assessment.data.database.dao

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import com.woundcare.assessment.data.database.entities.BWATAssessment
import org.threeten.bp.LocalDateTime

@Dao
interface BWATAssessmentDao {
    
    @Query("SELECT * FROM bwat_assessments ORDER BY assessment_date DESC")
    fun getAllAssessments(): Flow<List<BWATAssessment>>
    
    @Query("SELECT * FROM bwat_assessments WHERE wound_id = :woundId ORDER BY assessment_date DESC")
    fun getAssessmentsByWound(woundId: String): Flow<List<BWATAssessment>>
    
    @Query("SELECT * FROM bwat_assessments WHERE wound_id = :woundId ORDER BY assessment_date DESC")
    suspend fun getAssessmentsByWoundSync(woundId: String): List<BWATAssessment>
    
    @Query("SELECT * FROM bwat_assessments WHERE assessment_id = :assessmentId")
    suspend fun getAssessmentById(assessmentId: String): BWATAssessment?
    
    @Query("SELECT * FROM bwat_assessments WHERE assessment_id = :assessmentId")
    fun getAssessmentByIdFlow(assessmentId: String): Flow<BWATAssessment?>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE wound_id = :woundId 
        ORDER BY assessment_date DESC 
        LIMIT 1
    """)
    suspend fun getLatestAssessmentForWound(woundId: String): BWATAssessment?
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE wound_id = :woundId 
        ORDER BY assessment_date DESC 
        LIMIT 1
    """)
    fun getLatestAssessmentForWoundFlow(woundId: String): Flow<BWATAssessment?>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE wound_id = :woundId 
        ORDER BY assessment_date 
        LIMIT 1
    """)
    suspend fun getFirstAssessmentForWound(woundId: String): BWATAssessment?
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE assessment_date >= :startDate 
        AND assessment_date <= :endDate 
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE assessor_name = :assessorName 
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsByAssessor(assessorName: String): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE healing_status = :status 
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsByHealingStatus(status: String): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE total_score >= :minScore 
        AND total_score <= :maxScore 
        ORDER BY total_score DESC
    """)
    suspend fun getAssessmentsByScoreRange(minScore: Int, maxScore: Int): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE photos_taken = 1 
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsWithPhotos(): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE ai_analysis_completed = 1 
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsWithAIAnalysis(): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE next_assessment_date <= :date 
        AND next_assessment_date IS NOT NULL
        ORDER BY next_assessment_date
    """)
    suspend fun getAssessmentsDueForFollowUp(date: LocalDateTime): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE (signs_of_infection IS NOT NULL AND signs_of_infection != '')
        OR temperature_elevated = 1
        OR pain_score > 6
        ORDER BY assessment_date DESC
    """)
    suspend fun getAssessmentsWithComplications(): List<BWATAssessment>
    
    @Query("""
        SELECT * FROM bwat_assessments 
        WHERE wound_id = :woundId 
        AND assessment_date >= :since
        ORDER BY assessment_date DESC
        LIMIT :limit
    """)
    suspend fun getRecentAssessmentsForWound(woundId: String, since: LocalDateTime, limit: Int): List<BWATAssessment>
    
    @Query("SELECT COUNT(*) FROM bwat_assessments WHERE wound_id = :woundId")
    suspend fun getAssessmentCountForWound(woundId: String): Int
    
    @Query("SELECT COUNT(*) FROM bwat_assessments")
    suspend fun getTotalAssessmentCount(): Int
    
    @Query("SELECT COUNT(*) FROM bwat_assessments")
    fun getTotalAssessmentCountFlow(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM bwat_assessments WHERE healing_status = :status")
    suspend fun getAssessmentCountByHealingStatus(status: String): Int
    
    @Query("SELECT COUNT(*) FROM bwat_assessments WHERE ai_analysis_completed = 1")
    suspend fun getAIAnalyzedAssessmentCount(): Int
    
    @Query("SELECT AVG(total_score) FROM bwat_assessments WHERE wound_id = :woundId")
    suspend fun getAverageScoreForWound(woundId: String): Float?
    
    @Query("SELECT AVG(total_score) FROM bwat_assessments")
    suspend fun getOverallAverageScore(): Float?
    
    @Query("SELECT MIN(total_score) FROM bwat_assessments WHERE wound_id = :woundId")
    suspend fun getBestScoreForWound(woundId: String): Int?
    
    @Query("SELECT MAX(total_score) FROM bwat_assessments WHERE wound_id = :woundId")
    suspend fun getWorstScoreForWound(woundId: String): Int?
    
    @Query("""
        SELECT AVG(size_length * size_width) 
        FROM bwat_assessments 
        WHERE wound_id = :woundId 
        AND size_length > 0 AND size_width > 0
    """)
    suspend fun getAverageWoundAreaForWound(woundId: String): Float?
    
    @Query("SELECT DISTINCT assessor_name FROM bwat_assessments")
    suspend fun getDistinctAssessors(): List<String>
    
    @Query("SELECT DISTINCT healing_status FROM bwat_assessments")
    suspend fun getDistinctHealingStatuses(): List<String>
    
    @Query("SELECT DISTINCT treatment_response FROM bwat_assessments WHERE treatment_response IS NOT NULL")
    suspend fun getDistinctTreatmentResponses(): List<String>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAssessment(assessment: BWATAssessment): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAssessments(assessments: List<BWATAssessment>): List<Long>
    
    @Update
    suspend fun updateAssessment(assessment: BWATAssessment): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET updated_at = :updatedAt 
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateAssessmentTimestamp(assessmentId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET healing_status = :status,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateHealingStatus(assessmentId: String, status: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET total_score = :totalScore,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateTotalScore(assessmentId: String, totalScore: Int, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET ai_analysis_completed = :completed,
            ai_confidence_score = :confidenceScore,
            ai_recommendations = :recommendations,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateAIAnalysis(
        assessmentId: String,
        completed: Boolean,
        confidenceScore: Float?,
        recommendations: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET photos_taken = :photosTaken,
            photo_count = :photoCount,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updatePhotoInfo(
        assessmentId: String,
        photosTaken: Boolean,
        photoCount: Int,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET next_assessment_date = :nextDate,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateNextAssessmentDate(
        assessmentId: String,
        nextDate: LocalDateTime?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET treatment_plan = :treatmentPlan,
            treatment_response = :treatmentResponse,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateTreatmentInfo(
        assessmentId: String,
        treatmentPlan: String?,
        treatmentResponse: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE bwat_assessments 
        SET clinical_notes = :notes,
            updated_at = :updatedAt
        WHERE assessment_id = :assessmentId
    """)
    suspend fun updateClinicalNotes(assessmentId: String, notes: String?, updatedAt: LocalDateTime): Int
    
    @Delete
    suspend fun deleteAssessment(assessment: BWATAssessment): Int
    
    @Query("DELETE FROM bwat_assessments WHERE assessment_id = :assessmentId")
    suspend fun deleteAssessmentById(assessmentId: String): Int
    
    @Query("DELETE FROM bwat_assessments WHERE wound_id = :woundId")
    suspend fun deleteAssessmentsByWound(woundId: String): Int
    
    @Query("""
        DELETE FROM bwat_assessments 
        WHERE assessment_date < :cutoffDate
    """)
    suspend fun deleteOldAssessments(cutoffDate: LocalDateTime): Int
    
    @Transaction
    suspend fun insertOrUpdateAssessment(assessment: BWATAssessment): BWATAssessment {
        val existing = getAssessmentById(assessment.assessmentId)
        return if (existing != null) {
            updateAssessment(assessment.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            ))
            assessment.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            )
        } else {
            insertAssessment(assessment)
            assessment
        }
    }
    
    @Transaction
    suspend fun getProgressionDataForWound(woundId: String): List<BWATAssessment> {
        return getAssessmentsByWoundSync(woundId).sortedBy { it.assessmentDate }
    }
    
    @Transaction
    suspend fun getWoundHealingTrend(woundId: String, limit: Int = 10): List<Pair<LocalDateTime, Int>> {
        return getAssessmentsByWoundSync(woundId)
            .sortedByDescending { it.assessmentDate }
            .take(limit)
            .map { it.assessmentDate to it.totalScore }
            .reversed()
    }
    
    @Transaction
    suspend fun compareAssessments(assessmentId1: String, assessmentId2: String): Pair<BWATAssessment?, BWATAssessment?> {
        val assessment1 = getAssessmentById(assessmentId1)
        val assessment2 = getAssessmentById(assessmentId2)
        return Pair(assessment1, assessment2)
    }
    
    @Transaction
    suspend fun calculateHealingRate(woundId: String): Float? {
        val assessments = getAssessmentsByWoundSync(woundId).sortedBy { it.assessmentDate }
        if (assessments.size < 2) return null
        
        val first = assessments.first()
        val last = assessments.last()
        val scoreDifference = first.totalScore - last.totalScore
        val daysDifference = java.time.Duration.between(
            java.time.LocalDateTime.of(first.assessmentDate.year, first.assessmentDate.month, 
                first.assessmentDate.dayOfMonth, first.assessmentDate.hour, first.assessmentDate.minute),
            java.time.LocalDateTime.of(last.assessmentDate.year, last.assessmentDate.month, 
                last.assessmentDate.dayOfMonth, last.assessmentDate.hour, last.assessmentDate.minute)
        ).toDays()
        
        return if (daysDifference > 0) scoreDifference / daysDifference.toFloat() else null
    }
}