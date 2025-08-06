package com.woundcare.tracker.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.woundcare.tracker.models.Patient
import java.util.Date

@Dao
interface PatientDao {
    @Query("SELECT * FROM patients ORDER BY lastName, firstName")
    fun getAllPatients(): LiveData<List<Patient>>
    
    @Query("SELECT * FROM patients WHERE id = :patientId")
    suspend fun getPatientById(patientId: Long): Patient?
    
    @Query("SELECT * FROM patients WHERE firstName LIKE :query OR lastName LIKE :query OR medicalRecordNumber LIKE :query")
    suspend fun searchPatients(query: String): List<Patient>
    
    @Insert
    suspend fun insertPatient(patient: Patient): Long
    
    @Update
    suspend fun updatePatient(patient: Patient)
    
    @Delete
    suspend fun deletePatient(patient: Patient)
    
    @Query("UPDATE patients SET updatedAt = :date WHERE id = :patientId")
    suspend fun updatePatientTimestamp(patientId: Long, date: Date = Date())
    
    @Query("SELECT COUNT(*) FROM patients")
    suspend fun getPatientCount(): Int
    
    @Query("SELECT * FROM patients WHERE createdAt >= :startDate AND createdAt <= :endDate")
    suspend fun getPatientsByDateRange(startDate: Date, endDate: Date): List<Patient>
}