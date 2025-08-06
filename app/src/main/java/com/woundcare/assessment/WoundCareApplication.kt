package com.woundcare.assessment

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.Configuration
import com.jakewharton.threetenabp.AndroidThreeTen
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class WoundCareApplication : Application(), Configuration.Provider {

    @Inject
    lateinit var workerFactory: HiltWorkerFactory

    override fun onCreate() {
        super.onCreate()
        
        // Initialize ThreeTen library for date/time handling
        AndroidThreeTen.init(this)
        
        // Create notification channels
        createNotificationChannels()
    }

    override fun getWorkManagerConfiguration(): Configuration {
        return Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)
            
            // Assessment reminders channel
            val assessmentChannel = NotificationChannel(
                ASSESSMENT_CHANNEL_ID,
                "Assessment Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for wound assessment reminders"
                enableVibration(true)
                setShowBadge(true)
            }
            
            // Progress updates channel
            val progressChannel = NotificationChannel(
                PROGRESS_CHANNEL_ID,
                "Progress Updates",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Notifications for wound healing progress updates"
                enableVibration(false)
                setShowBadge(true)
            }
            
            // Critical alerts channel
            val criticalChannel = NotificationChannel(
                CRITICAL_CHANNEL_ID,
                "Critical Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical alerts requiring immediate attention"
                enableVibration(true)
                setShowBadge(true)
            }
            
            notificationManager.createNotificationChannels(
                listOf(assessmentChannel, progressChannel, criticalChannel)
            )
        }
    }

    companion object {
        const val ASSESSMENT_CHANNEL_ID = "assessment_reminders"
        const val PROGRESS_CHANNEL_ID = "progress_updates"
        const val CRITICAL_CHANNEL_ID = "critical_alerts"
    }
}