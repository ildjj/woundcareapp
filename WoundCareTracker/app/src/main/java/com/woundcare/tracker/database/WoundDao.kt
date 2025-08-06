package com.woundcare.tracker.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.woundcare.tracker.models.Wound
import java.util.Date

@Dao
interface WoundDao {
    @Query("SELECT * FROM wounds WHERE patientId = :patientId ORDER BY createdAt DESC")
    fun getWoundsByPatient(patientId: Long): LiveData<List<Wound>>
    
    @Query("SELECT * FROM wounds WHERE id = :woundId")
    suspend fun getWoundById(woundId: Long): Wound?
    
    @Query("SELECT * FROM wounds WHERE currentStatus = 'Active' ORDER BY updatedAt DESC")
    fun getActiveWounds(): LiveData<List<Wound>>
    
    @Query("SELECT * FROM wounds WHERE currentStatus = 'Healed' ORDER BY healedDate DESC")
    suspend fun getHealedWounds(): List<Wound>
    
    @Insert
    suspend fun insertWound(wound: Wound): Long
    
    @Update
    suspend fun updateWound(wound: Wound)
    
    @Delete
    suspend fun deleteWound(wound: Wound)
    
    @Query("UPDATE wounds SET currentStatus = :status, healedDate = :healedDate WHERE id = :woundId")
    suspend fun updateWoundStatus(woundId: Long, status: String, healedDate: Date? = null)
    
    @Query("SELECT COUNT(*) FROM wounds WHERE currentStatus = :status")
    suspend fun getWoundCountByStatus(status: String): Int
    
    @Query("SELECT * FROM wounds WHERE woundType = :type AND currentStatus = 'Active'")
    suspend fun getActiveWoundsByType(type: String): List<Wound>
    
    @Query("UPDATE wounds SET length = :length, width = :width, depth = :depth, area = :area WHERE id = :woundId")
    suspend fun updateWoundMeasurements(woundId: Long, length: Double?, width: Double?, depth: Double?, area: Double?)
}