package com.woundcare.assessment.data.database.dao

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import com.woundcare.assessment.data.database.entities.Wound
import org.threeten.bp.LocalDateTime

@Dao
interface WoundDao {
    
    @Query("SELECT * FROM wounds WHERE is_active = 1 ORDER BY discovery_date DESC")
    fun getAllActiveWounds(): Flow<List<Wound>>
    
    @Query("SELECT * FROM wounds WHERE patient_id = :patientId AND is_active = 1 ORDER BY wound_number")
    fun getWoundsByPatient(patientId: String): Flow<List<Wound>>
    
    @Query("SELECT * FROM wounds WHERE patient_id = :patientId AND is_active = 1 ORDER BY wound_number")
    suspend fun getWoundsByPatientSync(patientId: String): List<Wound>
    
    @Query("SELECT * FROM wounds WHERE wound_id = :woundId")
    suspend fun getWoundById(woundId: String): Wound?
    
    @Query("SELECT * FROM wounds WHERE wound_id = :woundId")
    fun getWoundByIdFlow(woundId: String): Flow<Wound?>
    
    @Query("SELECT * FROM wounds WHERE wound_type = :type AND is_active = 1")
    suspend fun getWoundsByType(type: String): List<Wound>
    
    @Query("SELECT * FROM wounds WHERE current_stage = :stage AND is_active = 1")
    suspend fun getWoundsByStage(stage: String): List<Wound>
    
    @Query("SELECT * FROM wounds WHERE healing_status = :status AND is_active = 1")
    suspend fun getWoundsByHealingStatus(status: String): List<Wound>
    
    @Query("SELECT * FROM wounds WHERE anatomical_location = :location AND is_active = 1")
    suspend fun getWoundsByLocation(location: String): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE follow_up_required = 1 
        AND next_assessment_date <= :date 
        AND is_active = 1
        ORDER BY next_assessment_date
    """)
    suspend fun getWoundsDueForAssessment(date: LocalDateTime): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE discovery_date >= :startDate 
        AND discovery_date <= :endDate 
        AND is_active = 1
        ORDER BY discovery_date DESC
    """)
    suspend fun getWoundsByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE (onset_date IS NOT NULL AND onset_date <= :cutoffDate)
        OR (onset_date IS NULL AND discovery_date <= :cutoffDate)
        AND is_active = 1
    """)
    suspend fun getChronicWounds(cutoffDate: LocalDateTime): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE (infection_signs IS NOT NULL AND infection_signs != '')
        OR pain_level > 7
        OR drainage_type = 'Purulent'
        AND is_active = 1
    """)
    suspend fun getWoundsRequiringUrgentAttention(): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE healing_status = 'Stalled'
        AND is_active = 1
        ORDER BY discovery_date
    """)
    suspend fun getStalledWounds(): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE healing_status = 'Deteriorating'
        AND is_active = 1
        ORDER BY discovery_date
    """)
    suspend fun getDeterioratingWounds(): List<Wound>
    
    @Query("""
        SELECT * FROM wounds 
        WHERE healing_status = 'Healed'
        AND closure_date IS NOT NULL
        ORDER BY closure_date DESC
    """)
    suspend fun getHealedWounds(): List<Wound>
    
    @Query("SELECT COUNT(*) FROM wounds WHERE patient_id = :patientId AND is_active = 1")
    suspend fun getWoundCountForPatient(patientId: String): Int
    
    @Query("SELECT COUNT(*) FROM wounds WHERE is_active = 1")
    suspend fun getTotalActiveWoundsCount(): Int
    
    @Query("SELECT COUNT(*) FROM wounds WHERE is_active = 1")
    fun getTotalActiveWoundsCountFlow(): Flow<Int>
    
    @Query("SELECT COUNT(*) FROM wounds WHERE wound_type = :type AND is_active = 1")
    suspend fun getWoundCountByType(type: String): Int
    
    @Query("SELECT COUNT(*) FROM wounds WHERE healing_status = :status AND is_active = 1")
    suspend fun getWoundCountByHealingStatus(status: String): Int
    
    @Query("SELECT DISTINCT wound_type FROM wounds WHERE is_active = 1")
    suspend fun getDistinctWoundTypes(): List<String>
    
    @Query("SELECT DISTINCT anatomical_location FROM wounds WHERE is_active = 1")
    suspend fun getDistinctAnatomicalLocations(): List<String>
    
    @Query("SELECT DISTINCT healing_status FROM wounds WHERE is_active = 1")
    suspend fun getDistinctHealingStatuses(): List<String>
    
    @Query("SELECT DISTINCT current_stage FROM wounds WHERE current_stage IS NOT NULL AND is_active = 1")
    suspend fun getDistinctStages(): List<String>
    
    @Query("SELECT MAX(wound_number) FROM wounds WHERE patient_id = :patientId")
    suspend fun getMaxWoundNumberForPatient(patientId: String): Int?
    
    @Query("""
        SELECT * FROM wounds 
        WHERE photography_consent = 0 
        AND is_active = 1
    """)
    suspend fun getWoundsWithoutPhotoConsent(): List<Wound>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWound(wound: Wound): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWounds(wounds: List<Wound>): List<Long>
    
    @Update
    suspend fun updateWound(wound: Wound): Int
    
    @Query("""
        UPDATE wounds 
        SET updated_at = :updatedAt 
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundTimestamp(woundId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wounds 
        SET healing_status = :status,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundHealingStatus(woundId: String, status: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wounds 
        SET current_stage = :stage,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundStage(woundId: String, stage: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wounds 
        SET next_assessment_date = :assessmentDate,
            follow_up_required = :followUpRequired,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundAssessmentSchedule(
        woundId: String,
        assessmentDate: LocalDateTime?,
        followUpRequired: Boolean,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wounds 
        SET pain_level = :painLevel,
            drainage_amount = :drainageAmount,
            drainage_type = :drainageType,
            odor_present = :odorPresent,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundCondition(
        woundId: String,
        painLevel: Int?,
        drainageAmount: String?,
        drainageType: String?,
        odorPresent: Boolean,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wounds 
        SET current_dressing = :dressing,
            dressing_change_frequency = :frequency,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updateWoundTreatment(
        woundId: String,
        dressing: String?,
        frequency: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wounds 
        SET healing_status = 'Healed',
            closure_date = :closureDate,
            closure_method = :closureMethod,
            follow_up_required = 0,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun markWoundAsHealed(
        woundId: String,
        closureDate: LocalDateTime,
        closureMethod: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE wounds 
        SET photography_consent = :consent,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun updatePhotoConsent(woundId: String, consent: Boolean, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wounds 
        SET is_active = 0,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun deactivateWound(woundId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE wounds 
        SET is_active = 1,
            updated_at = :updatedAt
        WHERE wound_id = :woundId
    """)
    suspend fun reactivateWound(woundId: String, updatedAt: LocalDateTime): Int
    
    @Delete
    suspend fun deleteWound(wound: Wound): Int
    
    @Query("DELETE FROM wounds WHERE wound_id = :woundId")
    suspend fun deleteWoundById(woundId: String): Int
    
    @Query("DELETE FROM wounds WHERE patient_id = :patientId")
    suspend fun deleteWoundsByPatient(patientId: String): Int
    
    @Query("DELETE FROM wounds WHERE is_active = 0")
    suspend fun deleteInactiveWounds(): Int
    
    @Transaction
    suspend fun insertOrUpdateWound(wound: Wound): Wound {
        val existing = getWoundById(wound.woundId)
        return if (existing != null) {
            updateWound(wound.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            ))
            wound.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            )
        } else {
            insertWound(wound)
            wound
        }
    }
    
    @Transaction
    suspend fun createNewWoundForPatient(patientId: String, wound: Wound): Wound {
        val nextWoundNumber = (getMaxWoundNumberForPatient(patientId) ?: 0) + 1
        val woundWithNumber = wound.copy(
            patientId = patientId,
            woundNumber = nextWoundNumber,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
        insertWound(woundWithNumber)
        return woundWithNumber
    }
    
    @Transaction
    suspend fun bulkUpdateWoundStatuses(woundIds: List<String>, isActive: Boolean): Int {
        val updatedAt = LocalDateTime.now()
        var totalUpdated = 0
        for (woundId in woundIds) {
            if (isActive) {
                totalUpdated += reactivateWound(woundId, updatedAt)
            } else {
                totalUpdated += deactivateWound(woundId, updatedAt)
            }
        }
        return totalUpdated
    }
}