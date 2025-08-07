package com.woundcare.tracker.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.woundcare.tracker.models.*

@Database(
    entities = [
        Patient::class,
        Wound::class,
        Assessment::class,
        WoundPhoto::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class WoundCareDatabase : RoomDatabase() {
    
    abstract fun patientDao(): PatientDao
    abstract fun woundDao(): WoundDao
    abstract fun assessmentDao(): AssessmentDao
    abstract fun woundPhotoDao(): WoundPhotoDao
    
    companion object {
        @Volatile
        private var INSTANCE: WoundCareDatabase? = null
        
        fun getDatabase(context: Context): WoundCareDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    WoundCareDatabase::class.java,
                    "wound_care_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}