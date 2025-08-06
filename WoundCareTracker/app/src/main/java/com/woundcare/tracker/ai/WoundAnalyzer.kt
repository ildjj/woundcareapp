package com.woundcare.tracker.ai

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.label.ImageLabeling
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions
import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.defaults.ObjectDetectorOptions
import kotlinx.coroutines.tasks.await
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel
import kotlin.math.pow
import kotlin.math.sqrt

/**
 * AI-powered wound analyzer using ML Kit and custom TensorFlow Lite models
 */
class WoundAnalyzer(private val context: Context) {
    
    private var interpreter: Interpreter? = null
    private val imageLabeler = ImageLabeling.getClient(ImageLabelerOptions.DEFAULT_OPTIONS)
    private val objectDetector = ObjectDetection.getClient(
        ObjectDetectorOptions.Builder()
            .setDetectorMode(ObjectDetectorOptions.SINGLE_IMAGE_MODE)
            .enableClassification()
            .build()
    )
    
    data class WoundAnalysisResult(
        val woundDetected: Boolean,
        val woundType: String?,
        val severity: WoundSeverity?,
        val tissueComposition: TissueComposition?,
        val colorAnalysis: ColorAnalysis,
        val estimatedArea: Double?, // in cm²
        val healingStage: String?,
        val recommendations: List<String>,
        val confidence: Float
    )
    
    data class TissueComposition(
        val granulation: Float, // percentage
        val slough: Float,
        val necrotic: Float,
        val epithelial: Float
    )
    
    data class ColorAnalysis(
        val dominantColor: String,
        val redPercentage: Float,
        val yellowPercentage: Float,
        val blackPercentage: Float,
        val pinkPercentage: Float
    )
    
    enum class WoundSeverity {
        SUPERFICIAL,
        PARTIAL_THICKNESS,
        FULL_THICKNESS,
        DEEP_TISSUE
    }
    
    suspend fun analyzeWound(bitmap: Bitmap): WoundAnalysisResult {
        val image = InputImage.fromBitmap(bitmap, 0)
        
        // Run ML Kit image labeling
        val labels = try {
            imageLabeler.process(image).await()
        } catch (e: Exception) {
            emptyList()
        }
        
        // Run ML Kit object detection
        val objects = try {
            objectDetector.process(image).await()
        } catch (e: Exception) {
            emptyList()
        }
        
        // Analyze colors in the image
        val colorAnalysis = analyzeColors(bitmap)
        
        // Determine if wound is detected
        val woundDetected = labels.any { label ->
            label.text.toLowerCase() in listOf("wound", "injury", "lesion", "ulcer") &&
            label.confidence > 0.7f
        }
        
        // Classify wound type based on visual characteristics
        val woundType = classifyWoundType(colorAnalysis, labels)
        
        // Estimate severity
        val severity = estimateSeverity(colorAnalysis)
        
        // Analyze tissue composition
        val tissueComposition = analyzeTissueComposition(bitmap, colorAnalysis)
        
        // Estimate healing stage
        val healingStage = determineHealingStage(tissueComposition, colorAnalysis)
        
        // Generate recommendations
        val recommendations = generateRecommendations(
            woundType,
            severity,
            tissueComposition,
            healingStage
        )
        
        // Calculate confidence score
        val confidence = if (woundDetected) {
            labels.filter { it.text.toLowerCase() in listOf("wound", "injury", "lesion", "ulcer") }
                .maxByOrNull { it.confidence }?.confidence ?: 0.5f
        } else {
            0.0f
        }
        
        return WoundAnalysisResult(
            woundDetected = woundDetected,
            woundType = woundType,
            severity = severity,
            tissueComposition = tissueComposition,
            colorAnalysis = colorAnalysis,
            estimatedArea = null, // Would require calibration marker
            healingStage = healingStage,
            recommendations = recommendations,
            confidence = confidence
        )
    }
    
    private fun analyzeColors(bitmap: Bitmap): ColorAnalysis {
        val pixels = IntArray(bitmap.width * bitmap.height)
        bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        
        var redCount = 0
        var yellowCount = 0
        var blackCount = 0
        var pinkCount = 0
        
        pixels.forEach { pixel ->
            val r = Color.red(pixel)
            val g = Color.green(pixel)
            val b = Color.blue(pixel)
            
            when {
                isRed(r, g, b) -> redCount++
                isYellow(r, g, b) -> yellowCount++
                isBlack(r, g, b) -> blackCount++
                isPink(r, g, b) -> pinkCount++
            }
        }
        
        val total = pixels.size.toFloat()
        
        val dominantColor = when {
            redCount > yellowCount && redCount > blackCount && redCount > pinkCount -> "Red"
            yellowCount > redCount && yellowCount > blackCount && yellowCount > pinkCount -> "Yellow"
            blackCount > redCount && blackCount > yellowCount && blackCount > pinkCount -> "Black"
            pinkCount > redCount && pinkCount > yellowCount && pinkCount > blackCount -> "Pink"
            else -> "Mixed"
        }
        
        return ColorAnalysis(
            dominantColor = dominantColor,
            redPercentage = (redCount / total) * 100,
            yellowPercentage = (yellowCount / total) * 100,
            blackPercentage = (blackCount / total) * 100,
            pinkPercentage = (pinkCount / total) * 100
        )
    }
    
    private fun isRed(r: Int, g: Int, b: Int): Boolean {
        return r > 150 && g < 100 && b < 100
    }
    
    private fun isYellow(r: Int, g: Int, b: Int): Boolean {
        return r > 200 && g > 180 && b < 100
    }
    
    private fun isBlack(r: Int, g: Int, b: Int): Boolean {
        return r < 50 && g < 50 && b < 50
    }
    
    private fun isPink(r: Int, g: Int, b: Int): Boolean {
        return r > 200 && g > 150 && g < 200 && b > 150 && b < 200
    }
    
    private fun classifyWoundType(
        colorAnalysis: ColorAnalysis,
        labels: List<com.google.mlkit.vision.label.ImageLabel>
    ): String? {
        // Simple classification based on color patterns and labels
        return when {
            colorAnalysis.blackPercentage > 30 -> "Necrotic wound"
            colorAnalysis.yellowPercentage > 40 -> "Sloughy wound"
            colorAnalysis.redPercentage > 50 -> "Granulating wound"
            colorAnalysis.pinkPercentage > 40 -> "Epithelializing wound"
            labels.any { it.text.toLowerCase().contains("pressure") } -> "Pressure ulcer"
            labels.any { it.text.toLowerCase().contains("diabetic") } -> "Diabetic ulcer"
            labels.any { it.text.toLowerCase().contains("venous") } -> "Venous ulcer"
            labels.any { it.text.toLowerCase().contains("arterial") } -> "Arterial ulcer"
            else -> "Unclassified wound"
        }
    }
    
    private fun estimateSeverity(colorAnalysis: ColorAnalysis): WoundSeverity {
        return when {
            colorAnalysis.blackPercentage > 50 -> WoundSeverity.DEEP_TISSUE
            colorAnalysis.blackPercentage > 20 || colorAnalysis.yellowPercentage > 50 -> 
                WoundSeverity.FULL_THICKNESS
            colorAnalysis.redPercentage > 60 -> WoundSeverity.PARTIAL_THICKNESS
            else -> WoundSeverity.SUPERFICIAL
        }
    }
    
    private fun analyzeTissueComposition(
        bitmap: Bitmap,
        colorAnalysis: ColorAnalysis
    ): TissueComposition {
        // Simplified tissue analysis based on color distribution
        val total = colorAnalysis.redPercentage + colorAnalysis.yellowPercentage + 
                   colorAnalysis.blackPercentage + colorAnalysis.pinkPercentage
        
        return if (total > 0) {
            TissueComposition(
                granulation = (colorAnalysis.redPercentage / total) * 100,
                slough = (colorAnalysis.yellowPercentage / total) * 100,
                necrotic = (colorAnalysis.blackPercentage / total) * 100,
                epithelial = (colorAnalysis.pinkPercentage / total) * 100
            )
        } else {
            TissueComposition(0f, 0f, 0f, 0f)
        }
    }
    
    private fun determineHealingStage(
        tissueComposition: TissueComposition,
        colorAnalysis: ColorAnalysis
    ): String {
        return when {
            tissueComposition.necrotic > 50 -> "Inflammatory phase - Necrotic tissue present"
            tissueComposition.slough > 50 -> "Inflammatory phase - Slough present"
            tissueComposition.granulation > 60 -> "Proliferative phase - Granulation"
            tissueComposition.epithelial > 40 -> "Maturation phase - Epithelialization"
            else -> "Mixed healing phases"
        }
    }
    
    private fun generateRecommendations(
        woundType: String?,
        severity: WoundSeverity?,
        tissueComposition: TissueComposition?,
        healingStage: String?
    ): List<String> {
        val recommendations = mutableListOf<String>()
        
        // Based on tissue composition
        tissueComposition?.let {
            if (it.necrotic > 20) {
                recommendations.add("Consider debridement to remove necrotic tissue")
            }
            if (it.slough > 30) {
                recommendations.add("Autolytic or enzymatic debridement may be beneficial")
            }
            if (it.granulation > 60) {
                recommendations.add("Protect granulation tissue with appropriate dressing")
            }
        }
        
        // Based on severity
        when (severity) {
            WoundSeverity.DEEP_TISSUE -> {
                recommendations.add("Urgent specialist referral recommended")
                recommendations.add("Consider advanced wound therapies")
            }
            WoundSeverity.FULL_THICKNESS -> {
                recommendations.add("Maintain moist wound environment")
                recommendations.add("Consider negative pressure therapy")
            }
            WoundSeverity.PARTIAL_THICKNESS -> {
                recommendations.add("Use appropriate moisture-retentive dressing")
            }
            WoundSeverity.SUPERFICIAL -> {
                recommendations.add("Keep wound clean and protected")
            }
            else -> {}
        }
        
        // General recommendations
        recommendations.add("Monitor for signs of infection")
        recommendations.add("Ensure adequate nutrition and hydration")
        recommendations.add("Document progress with regular photos")
        
        return recommendations
    }
    
    fun calculateWoundAreaFromImage(
        bitmap: Bitmap,
        referenceMarkerSizeCm: Double = 1.0
    ): Double? {
        // This would require detecting a reference marker in the image
        // and calculating the wound area based on pixel ratios
        // For now, returning null as it requires calibration
        return null
    }
    
    fun release() {
        interpreter?.close()
        imageLabeler.close()
        objectDetector.close()
    }
}