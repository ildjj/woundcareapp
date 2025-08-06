package com.woundcare.assessment.data.database

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import android.content.Context
import com.woundcare.assessment.data.database.entities.Patient
import com.woundcare.assessment.data.database.entities.Wound
import com.woundcare.assessment.data.database.entities.BWATAssessment
import com.woundcare.assessment.data.database.entities.WoundPhoto
import com.woundcare.assessment.data.database.dao.PatientDao
import com.woundcare.assessment.data.database.dao.WoundDao
import com.woundcare.assessment.data.database.dao.BWATAssessmentDao
import com.woundcare.assessment.data.database.dao.WoundPhotoDao
import com.woundcare.assessment.data.database.converters.DateTimeConverters
import net.sqlcipher.database.SQLiteDatabase
import net.sqlcipher.database.SupportFactory

@Database(
    entities = [
        Patient::class,
        Wound::class,
        BWATAssessment::class,
        WoundPhoto::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(DateTimeConverters::class)
abstract class WoundCareDatabase : RoomDatabase() {
    
    abstract fun patientDao(): PatientDao
    abstract fun woundDao(): WoundDao
    abstract fun bwatAssessmentDao(): BWATAssessmentDao
    abstract fun woundPhotoDao(): WoundPhotoDao
    
    companion object {
        const val DATABASE_NAME = "wound_care_database"
        private const val DATABASE_PASSPHRASE = "WoundCare_Secure_2024!"
        
        @Volatile
        private var INSTANCE: WoundCareDatabase? = null
        
        fun getDatabase(context: Context): WoundCareDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = buildDatabase(context)
                INSTANCE = instance
                instance
            }
        }
        
        private fun buildDatabase(context: Context): WoundCareDatabase {
            // Create encrypted database using SQLCipher
            val passphrase = SQLiteDatabase.getBytes(DATABASE_PASSPHRASE.toCharArray())
            val factory = SupportFactory(passphrase)
            
            return Room.databaseBuilder(
                context.applicationContext,
                WoundCareDatabase::class.java,
                DATABASE_NAME
            )
                .openHelperFactory(factory)
                .addMigrations(MIGRATION_1_2)
                .addCallback(DatabaseCallback())
                .build()
        }
        
        // Migration examples for future versions
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(database: SupportSQLiteDatabase) {
                // Example migration - add new column
                // database.execSQL("ALTER TABLE patients ADD COLUMN new_field TEXT")
            }
        }
        
        private class DatabaseCallback : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                // Pre-populate database with reference data if needed
                
                // Create indexes for better performance
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(medical_record_number)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(is_active)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_patients_consent ON patients(consent_signed, hipaa_authorization)")
                
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_wounds_patient ON wounds(patient_id)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_wounds_type ON wounds(wound_type)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_wounds_status ON wounds(healing_status)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_wounds_active ON wounds(is_active)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_wounds_assessment_date ON wounds(next_assessment_date)")
                
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_assessments_wound ON bwat_assessments(wound_id)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_assessments_date ON bwat_assessments(assessment_date)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_assessments_score ON bwat_assessments(total_score)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_assessments_healing ON bwat_assessments(healing_status)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_assessments_ai ON bwat_assessments(ai_analysis_completed)")
                
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_wound ON wound_photos(wound_id)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_assessment ON wound_photos(assessment_id)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_date ON wound_photos(taken_date)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_type ON wound_photos(photo_type)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_quality ON wound_photos(image_quality)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_ai_status ON wound_photos(ai_analysis_status)")
                db.execSQL("CREATE INDEX IF NOT EXISTS idx_photos_deleted ON wound_photos(is_deleted)")
                
                // Insert reference data
                insertReferenceData(db)
            }
            
            private fun insertReferenceData(db: SupportSQLiteDatabase) {
                // This could be used to insert lookup data, configuration settings, etc.
                // For now, we'll leave it empty as the app will handle dynamic data
            }
            
            override fun onOpen(db: SupportSQLiteDatabase) {
                super.onOpen(db)
                // Enable foreign key constraints
                db.execSQL("PRAGMA foreign_keys=ON")
                
                // Set some performance optimizations
                db.execSQL("PRAGMA journal_mode=WAL")
                db.execSQL("PRAGMA synchronous=NORMAL")
                db.execSQL("PRAGMA cache_size=10000")
                db.execSQL("PRAGMA temp_store=MEMORY")
            }
        }
        
        /**
         * Clear all data from database (for testing or reset purposes)
         */
        suspend fun clearAllTables(database: WoundCareDatabase) {
            database.clearAllTables()
        }
        
        /**
         * Check database integrity
         */
        suspend fun checkDatabaseIntegrity(database: WoundCareDatabase): Boolean {
            return try {
                database.openHelper.readableDatabase.use { db ->
                    val cursor = db.rawQuery("PRAGMA integrity_check", null)
                    cursor.use {
                        it.moveToFirst()
                        val result = it.getString(0)
                        result == "ok"
                    }
                }
            } catch (e: Exception) {
                false
            }
        }
        
        /**
         * Get database size in bytes
         */
        fun getDatabaseSize(context: Context): Long {
            val dbFile = context.getDatabasePath(DATABASE_NAME)
            return if (dbFile.exists()) dbFile.length() else 0L
        }
        
        /**
         * Export database for backup purposes
         */
        suspend fun exportDatabase(context: Context, exportPath: String): Boolean {
            return try {
                val dbFile = context.getDatabasePath(DATABASE_NAME)
                val exportFile = java.io.File(exportPath)
                
                if (dbFile.exists()) {
                    dbFile.copyTo(exportFile, overwrite = true)
                    true
                } else {
                    false
                }
            } catch (e: Exception) {
                false
            }
        }
        
        /**
         * Vacuum database to reclaim space
         */
        suspend fun vacuumDatabase(database: WoundCareDatabase) {
            database.openHelper.writableDatabase.use { db ->
                db.execSQL("VACUUM")
            }
        }
        
        /**
         * Get database statistics
         */
        suspend fun getDatabaseStats(database: WoundCareDatabase): Map<String, Int> {
            val patientCount = database.patientDao().getActivePatientCount()
            val woundCount = database.woundDao().getTotalActiveWoundsCount()
            val assessmentCount = database.bwatAssessmentDao().getTotalAssessmentCount()
            val photoCount = database.woundPhotoDao().getTotalPhotoCount()
            
            return mapOf(
                "patients" to patientCount,
                "wounds" to woundCount,
                "assessments" to assessmentCount,
                "photos" to photoCount
            )
        }
    }
}