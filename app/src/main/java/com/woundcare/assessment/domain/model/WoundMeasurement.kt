package com.woundcare.assessment.domain.model

import org.threeten.bp.LocalDateTime

/**
 * Comprehensive wound measurement data model with AI analysis
 */
data class WoundMeasurement(
    val measurementId: String,
    val woundId: String,
    val photoId: String?,
    val measurementDate: LocalDateTime,
    val measuredBy: String,
    val measurementMethod: MeasurementMethod,
    
    // Basic measurements
    val lengthCm: Float,
    val widthCm: Float,
    val depthCm: Float?,
    val areaCm2: Float,
    val volumeCm3: Float?,
    val circumferenceCm: Float?,
    
    // Advanced measurements
    val underminingMeasurements: List<UnderminingMeasurement>,
    val tunnelingMeasurements: List<TunnelingMeasurement>,
    val irregularityIndex: Float?, // Measure of wound shape complexity
    val aspectRatio: Float, // Length/Width ratio
    
    // AI-powered analysis
    val aiAnalysis: WoundMeasurementAI?,
    
    // Measurement quality
    val measurementAccuracy: MeasurementAccuracy,
    val calibrationData: CalibrationData?,
    
    // Clinical context
    val clinicalNotes: String?,
    val measurementPurpose: String, // Initial, Follow-up, Pre-procedure, Post-procedure
    val environmentalFactors: EnvironmentalFactors?,
    
    // Validation
    val validatedBy: String?,
    val validationDate: LocalDateTime?,
    val isValidated: Boolean = false
)

enum class MeasurementMethod {
    RULER_MANUAL,
    RULER_DIGITAL,
    DIGITAL_PLANIMETRY,
    AI_AUTOMATED,
    STEREO_PHOTOGRAMMETRY,
    CONTACT_TRACING,
    ACETATE_GRID,
    STRUCTURED_LIGHT
}

data class UnderminingMeasurement(
    val clockPosition: Int, // 1-12 o'clock
    val depthCm: Float,
    val extentDegrees: Int? // Angular extent in degrees
)

data class TunnelingMeasurement(
    val clockPosition: Int, // 1-12 o'clock
    val depthCm: Float,
    val direction: String?, // Direction of tunnel
    val diameter: Float? // Tunnel diameter if measurable
)

data class WoundMeasurementAI(
    val confidenceScore: Float, // 0.0-1.0
    val detectedEdges: List<EdgePoint>,
    val tissueMeasurements: TissueMeasurements,
    val qualityAssessment: ImageQualityAssessment,
    val comparisonAnalysis: ComparisonAnalysis?,
    val healingPrediction: HealingPrediction?,
    val recommendations: List<String>
)

data class EdgePoint(
    val x: Float,
    val y: Float,
    val confidence: Float,
    val edgeType: String // wound_edge, undermining_edge, tunnel_opening
)

data class TissueMeasurements(
    val granulationPercentage: Float,
    val sloughPercentage: Float,
    val escharPercentage: Float,
    val epithelializationPercentage: Float,
    val exposedStructures: List<String>, // bone, tendon, fascia, etc.
    val tissueViability: String // viable, non_viable, questionable
)

data class ImageQualityAssessment(
    val overallQuality: String, // excellent, good, fair, poor
    val lightingQuality: String,
    val focusQuality: String,
    val angleQuality: String,
    val scalePresent: Boolean,
    val obstructionsPresent: Boolean,
    val qualityIssues: List<String>
)

data class ComparisonAnalysis(
    val previousMeasurementId: String,
    val areaChange: Float, // Positive = increase, Negative = decrease
    val areaChangePercentage: Float,
    val volumeChange: Float?,
    val volumeChangePercentage: Float?,
    val healingRate: Float, // cm²/day
    val projectedHealingTime: Int?, // Days to closure if current rate continues
    val significantChanges: List<String>
)

data class HealingPrediction(
    val predictedHealingTimeWeeks: Int,
    val healingProbability: Float, // 0.0-1.0
    val riskFactors: List<String>,
    val recommendedInterventions: List<String>,
    val confidenceInterval: Pair<Int, Int> // Min, Max weeks
)

enum class MeasurementAccuracy {
    HIGH, // ±1mm
    MEDIUM, // ±2-3mm
    LOW, // ±5mm or more
    UNKNOWN
}

data class CalibrationData(
    val pixelsPerCm: Float,
    val referenceObject: String, // ruler, coin, grid
    val referenceSize: Float, // Known size in cm
    val calibrationMethod: String,
    val distortionCorrection: Boolean,
    val perspectiveCorrection: Boolean
)

data class EnvironmentalFactors(
    val lightingType: String, // natural, fluorescent, LED, flash
    val lightingIntensity: String, // bright, normal, dim
    val patientPosition: String, // supine, prone, lateral, sitting
    val woundLocation: String, // specific anatomical location
    val photographyDistance: Float?, // cm from wound
    val cameraAngle: Float?, // degrees from perpendicular
    val roomTemperature: Float?,
    val humidity: Float?
)

/**
 * Utility functions for wound measurements
 */
object WoundMeasurementUtils {
    
    /**
     * Calculate wound area using ellipse approximation
     */
    fun calculateEllipseArea(lengthCm: Float, widthCm: Float): Float {
        return (Math.PI * (lengthCm / 2) * (widthCm / 2)).toFloat()
    }
    
    /**
     * Calculate wound volume using ellipsoid approximation
     */
    fun calculateEllipsoidVolume(lengthCm: Float, widthCm: Float, depthCm: Float): Float {
        return ((4.0 / 3.0) * Math.PI * (lengthCm / 2) * (widthCm / 2) * (depthCm / 2)).toFloat()
    }
    
    /**
     * Calculate healing rate based on area change over time
     */
    fun calculateHealingRate(
        currentArea: Float,
        previousArea: Float,
        daysBetween: Int
    ): Float {
        return if (daysBetween > 0) {
            (previousArea - currentArea) / daysBetween
        } else 0f
    }
    
    /**
     * Estimate time to closure based on current healing rate
     */
    fun estimateHealingTime(currentArea: Float, healingRate: Float): Int? {
        return if (healingRate > 0) {
            (currentArea / healingRate).toInt()
        } else null
    }
    
    /**
     * Calculate measurement error margin
     */
    fun calculateErrorMargin(
        method: MeasurementMethod,
        imageQuality: String,
        calibrationPresent: Boolean
    ): Float {
        val baseError = when (method) {
            MeasurementMethod.AI_AUTOMATED -> 0.5f
            MeasurementMethod.DIGITAL_PLANIMETRY -> 1.0f
            MeasurementMethod.RULER_DIGITAL -> 1.5f
            MeasurementMethod.RULER_MANUAL -> 2.0f
            MeasurementMethod.STEREO_PHOTOGRAMMETRY -> 0.3f
            MeasurementMethod.CONTACT_TRACING -> 0.8f
            MeasurementMethod.ACETATE_GRID -> 2.5f
            MeasurementMethod.STRUCTURED_LIGHT -> 0.4f
        }
        
        val qualityMultiplier = when (imageQuality.lowercase()) {
            "excellent" -> 1.0f
            "good" -> 1.2f
            "fair" -> 1.5f
            "poor" -> 2.0f
            else -> 2.5f
        }
        
        val calibrationMultiplier = if (calibrationPresent) 1.0f else 1.5f
        
        return baseError * qualityMultiplier * calibrationMultiplier
    }
    
    /**
     * Validate measurement consistency
     */
    fun validateMeasurementConsistency(measurement: WoundMeasurement): List<String> {
        val issues = mutableListOf<String>()
        
        // Check basic measurement relationships
        if (measurement.lengthCm < measurement.widthCm) {
            issues.add("Length should typically be greater than or equal to width")
        }
        
        if (measurement.areaCm2 > measurement.lengthCm * measurement.widthCm) {
            issues.add("Calculated area exceeds rectangular area (length × width)")
        }
        
        measurement.depthCm?.let { depth ->
            if (depth > measurement.lengthCm || depth > measurement.widthCm) {
                issues.add("Depth measurement appears unusually large compared to surface dimensions")
            }
        }
        
        measurement.volumeCm3?.let { volume ->
            val maxPossibleVolume = measurement.lengthCm * measurement.widthCm * (measurement.depthCm ?: 0f)
            if (volume > maxPossibleVolume) {
                issues.add("Calculated volume exceeds maximum possible volume")
            }
        }
        
        // Check for unrealistic measurements
        if (measurement.lengthCm > 50f || measurement.widthCm > 50f) {
            issues.add("Measurements exceed typical wound size ranges")
        }
        
        measurement.depthCm?.let { depth ->
            if (depth > 20f) {
                issues.add("Depth measurement is exceptionally large")
            }
        }
        
        return issues
    }
    
    /**
     * Generate measurement summary
     */
    fun generateMeasurementSummary(measurement: WoundMeasurement): String {
        val sb = StringBuilder()
        
        sb.append("Wound Measurements:\n")
        sb.append("• Dimensions: ${measurement.lengthCm} × ${measurement.widthCm} cm")
        
        measurement.depthCm?.let {
            sb.append(" × $it cm (depth)")
        }
        
        sb.append("\n• Area: ${String.format("%.2f", measurement.areaCm2)} cm²")
        
        measurement.volumeCm3?.let {
            sb.append("\n• Volume: ${String.format("%.2f", it)} cm³")
        }
        
        if (measurement.underminingMeasurements.isNotEmpty()) {
            sb.append("\n• Undermining present at:")
            measurement.underminingMeasurements.forEach { undermining ->
                sb.append("\n  - ${undermining.clockPosition} o'clock: ${undermining.depthCm} cm")
            }
        }
        
        if (measurement.tunnelingMeasurements.isNotEmpty()) {
            sb.append("\n• Tunneling present at:")
            measurement.tunnelingMeasurements.forEach { tunneling ->
                sb.append("\n  - ${tunneling.clockPosition} o'clock: ${tunneling.depthCm} cm")
            }
        }
        
        measurement.aiAnalysis?.let { ai ->
            sb.append("\n\nAI Analysis (Confidence: ${String.format("%.1f", ai.confidenceScore * 100)}%):")
            sb.append("\n• Granulation: ${String.format("%.1f", ai.tissueMeasurements.granulationPercentage)}%")
            sb.append("\n• Slough: ${String.format("%.1f", ai.tissueMeasurements.sloughPercentage)}%")
            sb.append("\n• Eschar: ${String.format("%.1f", ai.tissueMeasurements.escharPercentage)}%")
            sb.append("\n• Epithelialization: ${String.format("%.1f", ai.tissueMeasurements.epithelializationPercentage)}%")
        }
        
        return sb.toString()
    }
}