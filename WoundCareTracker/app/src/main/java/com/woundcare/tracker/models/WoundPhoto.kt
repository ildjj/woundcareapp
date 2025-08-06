package com.woundcare.tracker.models

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey
import java.util.Date

@Entity(
    tableName = "wound_photos",
    foreignKeys = [
        ForeignKey(
            entity = Assessment::class,
            parentColumns = ["id"],
            childColumns = ["assessmentId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class WoundPhoto(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val assessmentId: Long,
    val photoPath: String,
    val thumbnailPath: String?,
    val captureDate: Date = Date(),
    val photoType: String, // Overview, Close-up, Ruler, Comparison
    val notes: String? = null,
    
    // AI Analysis metadata
    val aiProcessed: Boolean = false,
    val aiDetectedFeatures: String? = null,
    val aiMeasurements: String? = null,
    val aiColorAnalysis: String? = null,
    val aiTextureAnalysis: String? = null,
    
    // EXIF data
    val cameraModel: String? = null,
    val flashUsed: Boolean = false,
    val focalLength: Float? = null,
    val iso: Int? = null,
    
    val createdAt: Date = Date()
)