package com.woundcare.tracker.database

import androidx.lifecycle.LiveData
import androidx.room.*
import com.woundcare.tracker.models.WoundPhoto

@Dao
interface WoundPhotoDao {
    @Query("SELECT * FROM wound_photos WHERE assessmentId = :assessmentId ORDER BY captureDate DESC")
    fun getPhotosByAssessment(assessmentId: Long): LiveData<List<WoundPhoto>>
    
    @Query("SELECT * FROM wound_photos WHERE id = :photoId")
    suspend fun getPhotoById(photoId: Long): WoundPhoto?
    
    @Insert
    suspend fun insertPhoto(photo: WoundPhoto): Long
    
    @Update
    suspend fun updatePhoto(photo: WoundPhoto)
    
    @Delete
    suspend fun deletePhoto(photo: WoundPhoto)
    
    @Query("DELETE FROM wound_photos WHERE assessmentId = :assessmentId")
    suspend fun deletePhotosByAssessment(assessmentId: Long)
    
    @Query("SELECT COUNT(*) FROM wound_photos WHERE assessmentId = :assessmentId")
    suspend fun getPhotoCountForAssessment(assessmentId: Long): Int
    
    @Query("UPDATE wound_photos SET aiProcessed = 1, aiDetectedFeatures = :features, aiMeasurements = :measurements WHERE id = :photoId")
    suspend fun updateAIAnalysis(photoId: Long, features: String, measurements: String)
    
    @Query("SELECT * FROM wound_photos WHERE aiProcessed = 0 ORDER BY captureDate ASC")
    suspend fun getUnprocessedPhotos(): List<WoundPhoto>
}