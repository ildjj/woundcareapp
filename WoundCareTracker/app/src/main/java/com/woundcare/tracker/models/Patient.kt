package com.woundcare.tracker.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "patients")
data class Patient(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val firstName: String,
    val lastName: String,
    val dateOfBirth: Date,
    val gender: String,
    val medicalRecordNumber: String,
    val phoneNumber: String?,
    val email: String?,
    val address: String?,
    val emergencyContact: String?,
    val emergencyPhone: String?,
    val primaryDiagnosis: String?,
    val comorbidities: String?,
    val allergies: String?,
    val medications: String?,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
) {
    val fullName: String
        get() = "$firstName $lastName"
    
    val age: Int
        get() {
            val now = Date()
            val diff = now.time - dateOfBirth.time
            return (diff / (1000L * 60 * 60 * 24 * 365)).toInt()
        }
}