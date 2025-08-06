package com.woundcare.assessment.data.database.dao

import androidx.room.*
import androidx.lifecycle.LiveData
import kotlinx.coroutines.flow.Flow
import com.woundcare.assessment.data.database.entities.Patient
import org.threeten.bp.LocalDate
import org.threeten.bp.LocalDateTime

@Dao
interface PatientDao {
    
    @Query("SELECT * FROM patients WHERE is_active = 1 ORDER BY last_name, first_name")
    fun getAllActivePatients(): Flow<List<Patient>>
    
    @Query("SELECT * FROM patients WHERE is_active = 1 ORDER BY last_name, first_name")
    suspend fun getAllActivePatientsSync(): List<Patient>
    
    @Query("SELECT * FROM patients WHERE patient_id = :patientId")
    suspend fun getPatientById(patientId: String): Patient?
    
    @Query("SELECT * FROM patients WHERE patient_id = :patientId")
    fun getPatientByIdFlow(patientId: String): Flow<Patient?>
    
    @Query("SELECT * FROM patients WHERE medical_record_number = :mrn AND is_active = 1")
    suspend fun getPatientByMRN(mrn: String): Patient?
    
    @Query("""
        SELECT * FROM patients 
        WHERE (first_name LIKE '%' || :query || '%' 
        OR last_name LIKE '%' || :query || '%'
        OR medical_record_number LIKE '%' || :query || '%')
        AND is_active = 1
        ORDER BY last_name, first_name
    """)
    suspend fun searchPatients(query: String): List<Patient>
    
    @Query("""
        SELECT * FROM patients 
        WHERE date_of_birth BETWEEN :startDate AND :endDate
        AND is_active = 1
        ORDER BY date_of_birth
    """)
    suspend fun getPatientsByAgeRange(startDate: LocalDate, endDate: LocalDate): List<Patient>
    
    @Query("SELECT * FROM patients WHERE gender = :gender AND is_active = 1")
    suspend fun getPatientsByGender(gender: String): List<Patient>
    
    @Query("SELECT * FROM patients WHERE diabetes_type IS NOT NULL AND diabetes_type != 'None' AND is_active = 1")
    suspend fun getDiabeticPatients(): List<Patient>
    
    @Query("SELECT * FROM patients WHERE mobility_status = :status AND is_active = 1")
    suspend fun getPatientsByMobilityStatus(status: String): List<Patient>
    
    @Query("SELECT * FROM patients WHERE consent_signed = 0 AND is_active = 1")
    suspend fun getPatientsWithoutConsent(): List<Patient>
    
    @Query("SELECT * FROM patients WHERE hipaa_authorization = 0 AND is_active = 1")
    suspend fun getPatientsWithoutHIPAAAuthorization(): List<Patient>
    
    @Query("""
        SELECT * FROM patients 
        WHERE created_at >= :startDate 
        AND is_active = 1
        ORDER BY created_at DESC
    """)
    suspend fun getRecentPatients(startDate: LocalDateTime): List<Patient>
    
    @Query("SELECT COUNT(*) FROM patients WHERE is_active = 1")
    suspend fun getActivePatientCount(): Int
    
    @Query("SELECT COUNT(*) FROM patients WHERE is_active = 1")
    fun getActivePatientCountFlow(): Flow<Int>
    
    @Query("""
        SELECT COUNT(*) FROM patients 
        WHERE date_of_birth > :cutoffDate 
        AND is_active = 1
    """)
    suspend fun getMinorPatientCount(cutoffDate: LocalDate): Int
    
    @Query("SELECT DISTINCT gender FROM patients WHERE is_active = 1")
    suspend fun getDistinctGenders(): List<String>
    
    @Query("SELECT DISTINCT diabetes_type FROM patients WHERE diabetes_type IS NOT NULL AND is_active = 1")
    suspend fun getDistinctDiabetesTypes(): List<String>
    
    @Query("SELECT DISTINCT mobility_status FROM patients WHERE is_active = 1")
    suspend fun getDistinctMobilityStatuses(): List<String>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPatient(patient: Patient): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPatients(patients: List<Patient>): List<Long>
    
    @Update
    suspend fun updatePatient(patient: Patient): Int
    
    @Query("""
        UPDATE patients 
        SET updated_at = :updatedAt 
        WHERE patient_id = :patientId
    """)
    suspend fun updatePatientTimestamp(patientId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE patients 
        SET consent_signed = :consentSigned, 
            consent_date = :consentDate,
            hipaa_authorization = :hipaaAuth,
            updated_at = :updatedAt
        WHERE patient_id = :patientId
    """)
    suspend fun updatePatientConsent(
        patientId: String,
        consentSigned: Boolean,
        consentDate: LocalDateTime?,
        hipaaAuth: Boolean,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE patients 
        SET phone_number = :phoneNumber,
            email = :email,
            emergency_contact_name = :emergencyContactName,
            emergency_contact_phone = :emergencyContactPhone,
            updated_at = :updatedAt
        WHERE patient_id = :patientId
    """)
    suspend fun updatePatientContact(
        patientId: String,
        phoneNumber: String?,
        email: String?,
        emergencyContactName: String?,
        emergencyContactPhone: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE patients 
        SET medical_conditions = :conditions,
            medications = :medications,
            allergies = :allergies,
            updated_at = :updatedAt
        WHERE patient_id = :patientId
    """)
    suspend fun updatePatientMedicalInfo(
        patientId: String,
        conditions: String?,
        medications: String?,
        allergies: String?,
        updatedAt: LocalDateTime
    ): Int
    
    @Query("""
        UPDATE patients 
        SET is_active = 0,
            updated_at = :updatedAt
        WHERE patient_id = :patientId
    """)
    suspend fun deactivatePatient(patientId: String, updatedAt: LocalDateTime): Int
    
    @Query("""
        UPDATE patients 
        SET is_active = 1,
            updated_at = :updatedAt
        WHERE patient_id = :patientId
    """)
    suspend fun reactivatePatient(patientId: String, updatedAt: LocalDateTime): Int
    
    @Delete
    suspend fun deletePatient(patient: Patient): Int
    
    @Query("DELETE FROM patients WHERE patient_id = :patientId")
    suspend fun deletePatientById(patientId: String): Int
    
    @Query("DELETE FROM patients WHERE is_active = 0")
    suspend fun deleteInactivePatients(): Int
    
    @Transaction
    suspend fun insertOrUpdatePatient(patient: Patient): Patient {
        val existing = getPatientById(patient.patientId)
        return if (existing != null) {
            updatePatient(patient.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            ))
            patient.copy(
                createdAt = existing.createdAt,
                updatedAt = LocalDateTime.now()
            )
        } else {
            insertPatient(patient)
            patient
        }
    }
    
    @Transaction
    suspend fun bulkUpdatePatientStatuses(patientIds: List<String>, isActive: Boolean): Int {
        val updatedAt = LocalDateTime.now()
        var totalUpdated = 0
        for (patientId in patientIds) {
            if (isActive) {
                totalUpdated += reactivatePatient(patientId, updatedAt)
            } else {
                totalUpdated += deactivatePatient(patientId, updatedAt)
            }
        }
        return totalUpdated
    }
}