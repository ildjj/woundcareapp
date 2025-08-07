package com.woundcare.tracker.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.woundcare.tracker.models.Assessment
import java.util.Date

@Dao
interface AssessmentDao {
    @Query("SELECT * FROM assessments WHERE woundId = :woundId ORDER BY assessmentDate DESC")
    fun getAssessmentsByWound(woundId: Long): LiveData<List<Assessment>>
    
    @Query("SELECT * FROM assessments WHERE id = :assessmentId")
    suspend fun getAssessmentById(assessmentId: Long): Assessment?
    
    @Query("SELECT * FROM assessments WHERE assessmentType = :type ORDER BY assessmentDate DESC")
    suspend fun getAssessmentsByType(type: String): List<Assessment>
    
    @Insert
    suspend fun insertAssessment(assessment: Assessment): Long
    
    @Update
    suspend fun updateAssessment(assessment: Assessment)
    
    @Delete
    suspend fun deleteAssessment(assessment: Assessment)
    
    @Query("SELECT * FROM assessments WHERE woundId = :woundId ORDER BY assessmentDate DESC LIMIT 1")
    suspend fun getLatestAssessment(woundId: Long): Assessment?
    
    @Query("SELECT * FROM assessments WHERE assessmentDate >= :startDate AND assessmentDate <= :endDate")
    suspend fun getAssessmentsByDateRange(startDate: Date, endDate: Date): List<Assessment>
    
    @Query("SELECT COUNT(*) FROM assessments WHERE assessmentType = :type")
    suspend fun getAssessmentCountByType(type: String): Int
    
    @Query("SELECT AVG(bwatTotalScore) FROM assessments WHERE woundId = :woundId AND bwatTotalScore IS NOT NULL")
    suspend fun getAverageBWATScore(woundId: Long): Double?
    
    @Query("SELECT * FROM assessments WHERE aiAnalysisPerformed = 1 ORDER BY assessmentDate DESC")
    suspend fun getAIAnalyzedAssessments(): List<Assessment>
}