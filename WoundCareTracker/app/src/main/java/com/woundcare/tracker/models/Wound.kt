package com.woundcare.tracker.models

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import java.util.Date

@Entity(
    tableName = "wounds",
    foreignKeys = [
        ForeignKey(
            entity = Patient::class,
            parentColumns = ["id"],
            childColumns = ["patientId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Wound(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val patientId: Long,
    val woundType: String, // Pressure ulcer, Diabetic ulcer, Venous ulcer, Arterial ulcer, Surgical wound, Trauma
    val location: String, // Anatomical location
    val laterality: String, // Left, Right, Midline
    val dateOfOnset: Date,
    val etiology: String?, // Cause of wound
    val currentStatus: String, // Active, Healed, Infected
    val length: Double? = null, // in cm
    val width: Double? = null, // in cm
    val depth: Double? = null, // in cm
    val area: Double? = null, // in cm²
    val undermining: String? = null,
    val tunneling: String? = null,
    val woundBedAppearance: String? = null,
    val exudateAmount: String? = null, // None, Scant, Small, Moderate, Large
    val exudateType: String? = null, // Serous, Serosanguineous, Sanguineous, Purulent
    val odor: String? = null, // None, Mild, Moderate, Strong
    val periWoundCondition: String? = null,
    val pain: Int? = null, // 0-10 scale
    val createdAt: Date = Date(),
    val updatedAt: Date = Date(),
    val healedDate: Date? = null
)