package com.woundcare.assessment.ai

import android.content.Context
import android.graphics.Bitmap
import android.graphics.RectF
import androidx.annotation.WorkerThread
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import org.tensorflow.lite.support.image.ops.Rot90Op
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.woundcare.assessment.domain.model.*
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WoundAnalysisEngine @Inject constructor(
    private val context: Context
) {
    
    private var woundSegmentationInterpreter: Interpreter? = null
    private var woundClassificationInterpreter: Interpreter? = null
    private var healingPredictionInterpreter: Interpreter? = null
    private var tissueAnalysisInterpreter: Interpreter? = null
    
    private val imageProcessor = ImageProcessor.Builder()
        .add(ResizeOp(INPUT_HEIGHT, INPUT_WIDTH, ResizeOp.ResizeMethod.BILINEAR))
        .build()
    
    companion object {
        private const val WOUND_SEGMENTATION_MODEL = "wound_segmentation_model.tflite"
        private const val WOUND_CLASSIFICATION_MODEL = "wound_classification_model.tflite"
        private const val HEALING_PREDICTION_MODEL = "healing_prediction_model.tflite"
        private const val TISSUE_ANALYSIS_MODEL = "tissue_analysis_model.tflite"
        
        private const val INPUT_WIDTH = 512
        private const val INPUT_HEIGHT = 512
        private const val NUM_CHANNELS = 3
        
        // Model output indices
        private const val SEGMENTATION_OUTPUT_SIZE = INPUT_WIDTH * INPUT_HEIGHT
        private const val CLASSIFICATION_NUM_CLASSES = 6 // Pressure, Diabetic, Venous, etc.
        private const val TISSUE_NUM_CLASSES = 4 // Granulation, Slough, Eschar, Epithelialization
    }
    
    suspend fun initialize(): Boolean = withContext(Dispatchers.IO) {
        try {
            // Load wound segmentation model
            val segmentationModelBuffer = FileUtil.loadMappedFile(context, WOUND_SEGMENTATION_MODEL)
            woundSegmentationInterpreter = Interpreter(segmentationModelBuffer)
            
            // Load wound classification model
            val classificationModelBuffer = FileUtil.loadMappedFile(context, WOUND_CLASSIFICATION_MODEL)
            woundClassificationInterpreter = Interpreter(classificationModelBuffer)
            
            // Load healing prediction model
            val healingModelBuffer = FileUtil.loadMappedFile(context, HEALING_PREDICTION_MODEL)
            healingPredictionInterpreter = Interpreter(healingModelBuffer)
            
            // Load tissue analysis model
            val tissueModelBuffer = FileUtil.loadMappedFile(context, TISSUE_ANALYSIS_MODEL)
            tissueAnalysisInterpreter = Interpreter(tissueModelBuffer)
            
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    @WorkerThread
    suspend fun analyzeWoundImage(
        bitmap: Bitmap,
        calibrationData: CalibrationData? = null
    ): WoundAnalysisResult = withContext(Dispatchers.Default) {
        
        try {
            // Preprocess image
            val tensorImage = TensorImage.fromBitmap(bitmap)
            val processedImage = imageProcessor.process(tensorImage)
            
            // Run segmentation
            val segmentationResult = runWoundSegmentation(processedImage)
            
            // Run classification
            val classificationResult = runWoundClassification(processedImage)
            
            // Run tissue analysis
            val tissueAnalysisResult = runTissueAnalysis(processedImage)
            
            // Extract wound measurements
            val measurements = extractWoundMeasurements(
                segmentationResult, 
                bitmap.width, 
                bitmap.height, 
                calibrationData
            )
            
            // Assess image quality
            val qualityAssessment = assessImageQuality(bitmap, calibrationData)
            
            // Generate recommendations
            val recommendations = generateRecommendations(
                classificationResult, 
                tissueAnalysisResult, 
                measurements
            )
            
            WoundAnalysisResult(
                segmentationMask = segmentationResult.mask,
                woundBoundary = segmentationResult.boundary,
                woundType = classificationResult.predictedType,
                woundTypeConfidence = classificationResult.confidence,
                measurements = measurements,
                tissueComposition = tissueAnalysisResult,
                imageQuality = qualityAssessment,
                recommendations = recommendations,
                overallConfidence = calculateOverallConfidence(
                    segmentationResult.confidence,
                    classificationResult.confidence,
                    qualityAssessment.overallQuality
                )
            )
            
        } catch (e: Exception) {
            WoundAnalysisResult.error("Analysis failed: ${e.message}")
        }
    }
    
    @WorkerThread
    suspend fun predictHealing(
        woundHistory: List<WoundMeasurement>,
        patientFactors: PatientRiskFactors
    ): HealingPrediction = withContext(Dispatchers.Default) {
        
        try {
            val healingInterpreter = healingPredictionInterpreter ?: throw IllegalStateException("Model not initialized")
            
            // Prepare input features
            val inputBuffer = prepareHealingPredictionInput(woundHistory, patientFactors)
            
            // Prepare output
            val outputBuffer = ByteBuffer.allocateDirect(4 * 4) // 4 floats
            outputBuffer.order(ByteOrder.nativeOrder())
            
            // Run inference
            healingInterpreter.run(inputBuffer, outputBuffer)
            
            outputBuffer.rewind()
            val healingTimeWeeks = outputBuffer.float.toInt()
            val healingProbability = outputBuffer.float
            val riskScore = outputBuffer.float
            val uncertaintyScore = outputBuffer.float
            
            // Generate risk factors and recommendations
            val riskFactors = identifyRiskFactors(patientFactors, woundHistory)
            val interventions = recommendInterventions(riskScore, woundHistory.lastOrNull())
            
            HealingPrediction(
                predictedHealingTimeWeeks = healingTimeWeeks,
                healingProbability = healingProbability,
                riskFactors = riskFactors,
                recommendedInterventions = interventions,
                confidenceInterval = calculateConfidenceInterval(healingTimeWeeks, uncertaintyScore)
            )
            
        } catch (e: Exception) {
            // Return default prediction in case of error
            HealingPrediction(
                predictedHealingTimeWeeks = 12,
                healingProbability = 0.5f,
                riskFactors = listOf("Unable to assess - analysis error"),
                recommendedInterventions = listOf("Continue standard care"),
                confidenceInterval = Pair(8, 16)
            )
        }
    }
    
    private suspend fun runWoundSegmentation(tensorImage: TensorImage): SegmentationResult {
        val interpreter = woundSegmentationInterpreter ?: throw IllegalStateException("Model not initialized")
        
        // Prepare input
        val inputBuffer = tensorImage.buffer
        
        // Prepare output
        val outputBuffer = ByteBuffer.allocateDirect(4 * SEGMENTATION_OUTPUT_SIZE)
        outputBuffer.order(ByteOrder.nativeOrder())
        
        // Run inference
        interpreter.run(inputBuffer, outputBuffer)
        
        // Process output
        outputBuffer.rewind()
        val segmentationMask = FloatArray(SEGMENTATION_OUTPUT_SIZE)
        outputBuffer.asFloatBuffer().get(segmentationMask)
        
        // Extract wound boundary
        val boundary = extractWoundBoundary(segmentationMask)
        val confidence = calculateSegmentationConfidence(segmentationMask)
        
        return SegmentationResult(segmentationMask, boundary, confidence)
    }
    
    private suspend fun runWoundClassification(tensorImage: TensorImage): ClassificationResult {
        val interpreter = woundClassificationInterpreter ?: throw IllegalStateException("Model not initialized")
        
        // Prepare output
        val outputBuffer = ByteBuffer.allocateDirect(4 * CLASSIFICATION_NUM_CLASSES)
        outputBuffer.order(ByteOrder.nativeOrder())
        
        // Run inference
        interpreter.run(tensorImage.buffer, outputBuffer)
        
        // Process output
        outputBuffer.rewind()
        val probabilities = FloatArray(CLASSIFICATION_NUM_CLASSES)
        outputBuffer.asFloatBuffer().get(probabilities)
        
        // Find best prediction
        val maxIndex = probabilities.indices.maxByOrNull { probabilities[it] } ?: 0
        val woundTypes = arrayOf("Pressure", "Diabetic", "Venous", "Arterial", "Surgical", "Traumatic")
        
        return ClassificationResult(
            predictedType = woundTypes[maxIndex],
            confidence = probabilities[maxIndex],
            allProbabilities = probabilities.toList()
        )
    }
    
    private suspend fun runTissueAnalysis(tensorImage: TensorImage): TissueMeasurements {
        val interpreter = tissueAnalysisInterpreter ?: throw IllegalStateException("Model not initialized")
        
        // Prepare output
        val outputBuffer = ByteBuffer.allocateDirect(4 * TISSUE_NUM_CLASSES)
        outputBuffer.order(ByteOrder.nativeOrder())
        
        // Run inference
        interpreter.run(tensorImage.buffer, outputBuffer)
        
        // Process output
        outputBuffer.rewind()
        val tissuePercentages = FloatArray(TISSUE_NUM_CLASSES)
        outputBuffer.asFloatBuffer().get(tissuePercentages)
        
        return TissueMeasurements(
            granulationPercentage = tissuePercentages[0] * 100,
            sloughPercentage = tissuePercentages[1] * 100,
            escharPercentage = tissuePercentages[2] * 100,
            epithelializationPercentage = tissuePercentages[3] * 100,
            exposedStructures = emptyList(), // Would need additional analysis
            tissueViability = determineViability(tissuePercentages)
        )
    }
    
    private fun extractWoundMeasurements(
        segmentationResult: SegmentationResult,
        imageWidth: Int,
        imageHeight: Int,
        calibrationData: CalibrationData?
    ): AIWoundMeasurements {
        
        val pixelsPerCm = calibrationData?.pixelsPerCm ?: estimatePixelsPerCm(imageWidth, imageHeight)
        
        // Calculate area from segmentation mask
        val woundPixels = segmentationResult.mask.count { it > 0.5f }
        val areaCm2 = woundPixels / (pixelsPerCm * pixelsPerCm)
        
        // Estimate dimensions from boundary
        val boundary = segmentationResult.boundary
        val (lengthCm, widthCm) = calculateDimensionsFromBoundary(boundary, pixelsPerCm)
        
        return AIWoundMeasurements(
            areaCm2 = areaCm2,
            lengthCm = lengthCm,
            widthCm = widthCm,
            perimeterCm = calculatePerimeter(boundary, pixelsPerCm),
            irregularityIndex = calculateIrregularityIndex(boundary),
            confidence = segmentationResult.confidence
        )
    }
    
    private fun assessImageQuality(bitmap: Bitmap, calibrationData: CalibrationData?): ImageQualityAssessment {
        
        val focusQuality = assessFocusQuality(bitmap)
        val lightingQuality = assessLightingQuality(bitmap)
        val angleQuality = assessAngleQuality(bitmap)
        val scalePresent = calibrationData != null
        
        val overallQuality = when {
            focusQuality == "excellent" && lightingQuality == "excellent" && scalePresent -> "excellent"
            focusQuality == "good" && lightingQuality == "good" -> "good"
            focusQuality == "fair" || lightingQuality == "fair" -> "fair"
            else -> "poor"
        }
        
        val qualityIssues = mutableListOf<String>()
        if (focusQuality == "poor") qualityIssues.add("Image appears blurry or out of focus")
        if (lightingQuality == "poor") qualityIssues.add("Poor lighting conditions")
        if (!scalePresent) qualityIssues.add("No calibration reference present")
        
        return ImageQualityAssessment(
            overallQuality = overallQuality,
            lightingQuality = lightingQuality,
            focusQuality = focusQuality,
            angleQuality = angleQuality,
            scalePresent = scalePresent,
            obstructionsPresent = false, // Would need additional analysis
            qualityIssues = qualityIssues
        )
    }
    
    private fun generateRecommendations(
        classification: ClassificationResult,
        tissueAnalysis: TissueMeasurements,
        measurements: AIWoundMeasurements
    ): List<String> {
        
        val recommendations = mutableListOf<String>()
        
        // Recommendations based on wound type
        when (classification.predictedType) {
            "Pressure" -> {
                recommendations.add("Implement pressure redistribution strategies")
                recommendations.add("Assess and optimize nutrition")
            }
            "Diabetic" -> {
                recommendations.add("Optimize glycemic control")
                recommendations.add("Assess vascular status")
                recommendations.add("Consider offloading devices")
            }
            "Venous" -> {
                recommendations.add("Implement compression therapy")
                recommendations.add("Elevate affected limb")
            }
        }
        
        // Recommendations based on tissue analysis
        if (tissueAnalysis.sloughPercentage > 25) {
            recommendations.add("Consider debridement of slough tissue")
        }
        if (tissueAnalysis.escharPercentage > 10) {
            recommendations.add("Evaluate need for eschar removal")
        }
        if (tissueAnalysis.granulationPercentage < 50) {
            recommendations.add("Optimize wound bed preparation")
        }
        
        // Recommendations based on measurements
        if (measurements.areaCm2 > 10) {
            recommendations.add("Consider advanced wound therapies for large wound")
        }
        if (measurements.irregularityIndex > 0.7) {
            recommendations.add("Irregular wound shape may require specialized care")
        }
        
        return recommendations.distinct()
    }
    
    // Helper functions for various calculations
    private fun extractWoundBoundary(mask: FloatArray): List<EdgePoint> {
        // Implementation for edge detection from segmentation mask
        // This would use edge detection algorithms to find boundary points
        return emptyList() // Placeholder
    }
    
    private fun calculateSegmentationConfidence(mask: FloatArray): Float {
        // Calculate confidence based on mask certainty
        return mask.average().toFloat()
    }
    
    private fun calculateDimensionsFromBoundary(boundary: List<EdgePoint>, pixelsPerCm: Float): Pair<Float, Float> {
        // Calculate length and width from boundary points
        // This would find the major and minor axes of the wound
        return Pair(5.0f, 3.0f) // Placeholder
    }
    
    private fun calculatePerimeter(boundary: List<EdgePoint>, pixelsPerCm: Float): Float {
        // Calculate perimeter from boundary points
        return 10.0f // Placeholder
    }
    
    private fun calculateIrregularityIndex(boundary: List<EdgePoint>): Float {
        // Calculate how irregular the wound shape is (0 = circle, 1 = very irregular)
        return 0.3f // Placeholder
    }
    
    private fun assessFocusQuality(bitmap: Bitmap): String {
        // Analyze image sharpness using gradient magnitude
        return "good" // Placeholder
    }
    
    private fun assessLightingQuality(bitmap: Bitmap): String {
        // Analyze lighting uniformity and brightness
        return "good" // Placeholder
    }
    
    private fun assessAngleQuality(bitmap: Bitmap): String {
        // Assess if image is taken from appropriate angle
        return "good" // Placeholder
    }
    
    private fun estimatePixelsPerCm(width: Int, height: Int): Float {
        // Estimate based on typical photography distances
        return 50.0f // Placeholder - would need more sophisticated estimation
    }
    
    private fun prepareHealingPredictionInput(
        woundHistory: List<WoundMeasurement>,
        patientFactors: PatientRiskFactors
    ): ByteBuffer {
        // Prepare input tensor for healing prediction model
        val inputBuffer = ByteBuffer.allocateDirect(4 * 20) // 20 features
        inputBuffer.order(ByteOrder.nativeOrder())
        
        // Add wound progression features
        if (woundHistory.isNotEmpty()) {
            val latest = woundHistory.last()
            inputBuffer.putFloat(latest.areaCm2)
            inputBuffer.putFloat(latest.lengthCm)
            inputBuffer.putFloat(latest.widthCm)
            inputBuffer.putFloat(latest.depthCm ?: 0f)
        }
        
        // Add patient risk factors
        inputBuffer.putFloat(if (patientFactors.hasDiabetes) 1f else 0f)
        inputBuffer.putFloat(patientFactors.age.toFloat())
        inputBuffer.putFloat(if (patientFactors.isImmunocompromised) 1f else 0f)
        
        // Fill remaining features with zeros or calculated values
        repeat(13) { inputBuffer.putFloat(0f) }
        
        inputBuffer.rewind()
        return inputBuffer
    }
    
    private fun identifyRiskFactors(
        patientFactors: PatientRiskFactors,
        woundHistory: List<WoundMeasurement>
    ): List<String> {
        val riskFactors = mutableListOf<String>()
        
        if (patientFactors.hasDiabetes) riskFactors.add("Diabetes mellitus")
        if (patientFactors.isImmunocompromised) riskFactors.add("Immunocompromised status")
        if (patientFactors.age > 65) riskFactors.add("Advanced age")
        if (patientFactors.hasVascularDisease) riskFactors.add("Vascular disease")
        if (patientFactors.isSmoker) riskFactors.add("Smoking")
        if (patientFactors.hasPoorNutrition) riskFactors.add("Poor nutritional status")
        
        // Analyze wound progression
        if (woundHistory.size >= 2) {
            val recent = woundHistory.takeLast(2)
            if (recent[1].areaCm2 > recent[0].areaCm2) {
                riskFactors.add("Wound enlargement")
            }
        }
        
        return riskFactors
    }
    
    private fun recommendInterventions(riskScore: Float, latestMeasurement: WoundMeasurement?): List<String> {
        val interventions = mutableListOf<String>()
        
        when {
            riskScore > 0.8f -> {
                interventions.add("Intensive wound care protocol")
                interventions.add("Consider advanced therapies")
                interventions.add("Frequent monitoring")
            }
            riskScore > 0.6f -> {
                interventions.add("Enhanced wound care regimen")
                interventions.add("Address modifiable risk factors")
            }
            else -> {
                interventions.add("Continue standard wound care")
                interventions.add("Regular assessment")
            }
        }
        
        return interventions
    }
    
    private fun calculateConfidenceInterval(prediction: Int, uncertainty: Float): Pair<Int, Int> {
        val margin = (prediction * uncertainty).toInt()
        return Pair(
            maxOf(1, prediction - margin),
            prediction + margin
        )
    }
    
    private fun calculateOverallConfidence(
        segmentationConfidence: Float,
        classificationConfidence: Float,
        imageQuality: String
    ): Float {
        val qualityWeight = when (imageQuality) {
            "excellent" -> 1.0f
            "good" -> 0.8f
            "fair" -> 0.6f
            else -> 0.4f
        }
        
        return (segmentationConfidence + classificationConfidence) / 2 * qualityWeight
    }
    
    private fun determineViability(tissuePercentages: FloatArray): String {
        val viable = tissuePercentages[0] // Granulation percentage
        val nonViable = tissuePercentages[1] + tissuePercentages[2] // Slough + Eschar
        
        return when {
            viable > 0.7f -> "viable"
            nonViable > 0.5f -> "non_viable"
            else -> "questionable"
        }
    }
    
    fun release() {
        woundSegmentationInterpreter?.close()
        woundClassificationInterpreter?.close()
        healingPredictionInterpreter?.close()
        tissueAnalysisInterpreter?.close()
    }
}

// Data classes for AI analysis results
data class WoundAnalysisResult(
    val segmentationMask: FloatArray?,
    val woundBoundary: List<EdgePoint>,
    val woundType: String,
    val woundTypeConfidence: Float,
    val measurements: AIWoundMeasurements,
    val tissueComposition: TissueMeasurements,
    val imageQuality: ImageQualityAssessment,
    val recommendations: List<String>,
    val overallConfidence: Float,
    val error: String? = null
) {
    companion object {
        fun error(message: String) = WoundAnalysisResult(
            segmentationMask = null,
            woundBoundary = emptyList(),
            woundType = "Unknown",
            woundTypeConfidence = 0f,
            measurements = AIWoundMeasurements(0f, 0f, 0f, 0f, 0f, 0f),
            tissueComposition = TissueMeasurements(0f, 0f, 0f, 0f, emptyList(), "unknown"),
            imageQuality = ImageQualityAssessment("poor", "poor", "poor", "poor", false, false, listOf(message)),
            recommendations = emptyList(),
            overallConfidence = 0f,
            error = message
        )
    }
}

data class SegmentationResult(
    val mask: FloatArray,
    val boundary: List<EdgePoint>,
    val confidence: Float
)

data class ClassificationResult(
    val predictedType: String,
    val confidence: Float,
    val allProbabilities: List<Float>
)

data class AIWoundMeasurements(
    val areaCm2: Float,
    val lengthCm: Float,
    val widthCm: Float,
    val perimeterCm: Float,
    val irregularityIndex: Float,
    val confidence: Float
)

data class PatientRiskFactors(
    val age: Int,
    val hasDiabetes: Boolean,
    val isImmunocompromised: Boolean,
    val hasVascularDisease: Boolean,
    val isSmoker: Boolean,
    val hasPoorNutrition: Boolean,
    val mobilityStatus: String
)