package com.woundcare.assessment.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ColumnInfo
import org.threeten.bp.LocalDate
import org.threeten.bp.LocalDateTime

@Entity(tableName = "patients")
data class Patient(
    @PrimaryKey
    @ColumnInfo(name = "patient_id")
    val patientId: String,
    
    @ColumnInfo(name = "first_name")
    val firstName: String,
    
    @ColumnInfo(name = "last_name")
    val lastName: String,
    
    @ColumnInfo(name = "date_of_birth")
    val dateOfBirth: LocalDate,
    
    @ColumnInfo(name = "gender")
    val gender: String, // Male, Female, Other, Prefer not to say
    
    @ColumnInfo(name = "medical_record_number")
    val medicalRecordNumber: String?,
    
    @ColumnInfo(name = "phone_number")
    val phoneNumber: String?,
    
    @ColumnInfo(name = "email")
    val email: String?,
    
    @ColumnInfo(name = "emergency_contact_name")
    val emergencyContactName: String?,
    
    @ColumnInfo(name = "emergency_contact_phone")
    val emergencyContactPhone: String?,
    
    @ColumnInfo(name = "allergies")
    val allergies: String?, // JSON string of allergies
    
    @ColumnInfo(name = "medical_conditions")
    val medicalConditions: String?, // JSON string of conditions
    
    @ColumnInfo(name = "medications")
    val medications: String?, // JSON string of current medications
    
    @ColumnInfo(name = "diabetes_type")
    val diabetesType: String?, // None, Type1, Type2, Gestational
    
    @ColumnInfo(name = "mobility_status")
    val mobilityStatus: String, // Ambulatory, Limited, Wheelchair, Bedbound
    
    @ColumnInfo(name = "nutritional_status")
    val nutritionalStatus: String, // Well-nourished, Malnourished, At-risk
    
    @ColumnInfo(name = "smoking_status")
    val smokingStatus: String, // Never, Former, Current
    
    @ColumnInfo(name = "insurance_provider")
    val insuranceProvider: String?,
    
    @ColumnInfo(name = "insurance_number")
    val insuranceNumber: String?,
    
    @ColumnInfo(name = "primary_physician")
    val primaryPhysician: String?,
    
    @ColumnInfo(name = "referring_physician")
    val referringPhysician: String?,
    
    @ColumnInfo(name = "care_facility")
    val careFacility: String?,
    
    @ColumnInfo(name = "admission_date")
    val admissionDate: LocalDate?,
    
    @ColumnInfo(name = "notes")
    val notes: String?,
    
    @ColumnInfo(name = "created_at")
    val createdAt: LocalDateTime,
    
    @ColumnInfo(name = "updated_at")
    val updatedAt: LocalDateTime,
    
    @ColumnInfo(name = "is_active")
    val isActive: Boolean = true,
    
    @ColumnInfo(name = "consent_signed")
    val consentSigned: Boolean = false,
    
    @ColumnInfo(name = "consent_date")
    val consentDate: LocalDateTime?,
    
    @ColumnInfo(name = "hipaa_authorization")
    val hipaaAuthorization: Boolean = false,
    
    @ColumnInfo(name = "encrypted_ssn")
    val encryptedSsn: String? // Encrypted Social Security Number
) {
    
    fun getFullName(): String = "$firstName $lastName"
    
    fun getAge(): Int {
        val today = LocalDate.now()
        return today.year - dateOfBirth.year - 
            if (today.dayOfYear < dateOfBirth.dayOfYear) 1 else 0
    }
    
    fun isMinor(): Boolean = getAge() < 18
    
    fun hasValidConsent(): Boolean = consentSigned && hipaaAuthorization
}