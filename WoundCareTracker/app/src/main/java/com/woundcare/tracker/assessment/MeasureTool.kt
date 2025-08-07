package com.woundcare.tracker.assessment

import kotlin.math.*

/**
 * MEASURE Tool - Wound Measurement and Documentation Tool
 * Provides standardized wound measurement methods and calculations
 */
class MeasureTool {
    
    data class WoundMeasurements(
        val length: Double, // in cm
        val width: Double, // in cm
        val depth: Double?, // in cm (optional)
        val underminingLocations: List<UnderminingMeasurement> = emptyList(),
        val tunnelingLocations: List<TunnelingMeasurement> = emptyList()
    ) {
        val area: Double
            get() = calculateArea(length, width)
        
        val volume: Double?
            get() = depth?.let { calculateVolume(length, width, it) }
        
        val perimeter: Double
            get() = calculatePerimeter(length, width)
    }
    
    data class UnderminingMeasurement(
        val clockPosition: Int, // 1-12
        val depth: Double // in cm
    )
    
    data class TunnelingMeasurement(
        val clockPosition: Int, // 1-12
        val length: Double // in cm
    )
    
    data class MeasurementMethod(
        val name: String,
        val description: String,
        val instructions: List<String>
    )
    
    companion object {
        
        fun getMeasurementMethods(): List<MeasurementMethod> {
            return listOf(
                MeasurementMethod(
                    name = "Linear Measurement (Length x Width)",
                    description = "Most common method using greatest length and perpendicular width",
                    instructions = listOf(
                        "Position wound with head at 12 o'clock",
                        "Measure greatest length (head to toe direction)",
                        "Measure greatest width perpendicular to length",
                        "Record measurements in centimeters",
                        "Use disposable ruler or measurement guide"
                    )
                ),
                
                MeasurementMethod(
                    name = "Clock Method",
                    description = "Uses clock positions for documenting undermining and tunneling",
                    instructions = listOf(
                        "Position patient with head at 12 o'clock",
                        "Probe wound edges gently with sterile cotton swab",
                        "Document undermining/tunneling by clock position",
                        "Measure depth at each clock position",
                        "Record all measurements in centimeters"
                    )
                ),
                
                MeasurementMethod(
                    name = "Planimetry (Tracing)",
                    description = "Wound tracing on transparent film for area calculation",
                    instructions = listOf(
                        "Place sterile transparent film over wound",
                        "Trace wound perimeter with permanent marker",
                        "Transfer tracing to grid paper",
                        "Count squares within wound outline",
                        "Calculate area based on grid scale"
                    )
                ),
                
                MeasurementMethod(
                    name = "Digital Photography",
                    description = "Standardized photos with reference markers",
                    instructions = listOf(
                        "Include ruler or calibration marker in frame",
                        "Maintain consistent distance (30-40 cm)",
                        "Use same angle for serial photos",
                        "Ensure adequate lighting without shadows",
                        "Take photos before and after cleansing"
                    )
                )
            )
        }
        
        fun calculateArea(length: Double, width: Double): Double {
            return length * width
        }
        
        fun calculateVolume(length: Double, width: Double, depth: Double): Double {
            // Using elliptical cylinder approximation
            return (PI * length * width * depth) / 4
        }
        
        fun calculatePerimeter(length: Double, width: Double): Double {
            // Ramanujan's approximation for ellipse perimeter
            val a = length / 2
            val b = width / 2
            val h = ((a - b) * (a - b)) / ((a + b) * (a + b))
            return PI * (a + b) * (1 + (3 * h) / (10 + sqrt(4 - 3 * h)))
        }
        
        fun calculatePercentageChange(oldArea: Double, newArea: Double): Double {
            return ((oldArea - newArea) / oldArea) * 100
        }
        
        fun getHealingRate(initialArea: Double, currentArea: Double, daysBetween: Int): Double {
            val areaReduction = initialArea - currentArea
            return areaReduction / daysBetween // cm²/day
        }
        
        fun predictHealingTime(currentArea: Double, healingRate: Double): Int? {
            return if (healingRate > 0) {
                ceil(currentArea / healingRate).toInt()
            } else null
        }
        
        fun interpretHealingProgress(percentageChange: Double, weeksBetween: Int): String {
            val weeklyRate = percentageChange / weeksBetween
            
            return when {
                weeklyRate >= 10 -> "Excellent healing progress (>10% per week)"
                weeklyRate >= 7.5 -> "Good healing progress (7.5-10% per week)"
                weeklyRate >= 5 -> "Adequate healing progress (5-7.5% per week)"
                weeklyRate >= 2.5 -> "Slow healing progress (2.5-5% per week)"
                weeklyRate > 0 -> "Minimal healing progress (<2.5% per week)"
                weeklyRate == 0.0 -> "No change in wound size"
                else -> "Wound deterioration - increasing in size"
            }
        }
        
        fun getRecommendationsBasedOnProgress(percentageChange: Double, weeksBetween: Int): List<String> {
            val weeklyRate = percentageChange / weeksBetween
            val recommendations = mutableListOf<String>()
            
            when {
                weeklyRate >= 10 -> {
                    recommendations.add("Continue current treatment protocol")
                    recommendations.add("Maintain consistent wound care routine")
                    recommendations.add("Document factors contributing to success")
                }
                weeklyRate >= 5 -> {
                    recommendations.add("Current treatment showing effectiveness")
                    recommendations.add("Consider optimizing nutrition and hydration")
                    recommendations.add("Ensure adequate offloading/pressure relief")
                }
                weeklyRate >= 2.5 -> {
                    recommendations.add("Re-evaluate current treatment plan")
                    recommendations.add("Consider advanced wound therapies")
                    recommendations.add("Assess for infection or biofilm")
                    recommendations.add("Review systemic factors affecting healing")
                }
                weeklyRate > 0 -> {
                    recommendations.add("Urgent reassessment needed")
                    recommendations.add("Consider wound culture and sensitivity")
                    recommendations.add("Evaluate for underlying osteomyelitis")
                    recommendations.add("Consider specialist referral")
                }
                else -> {
                    recommendations.add("Immediate intervention required")
                    recommendations.add("Rule out infection or critical colonization")
                    recommendations.add("Consider debridement if appropriate")
                    recommendations.add("Urgent specialist consultation recommended")
                }
            }
            
            return recommendations
        }
        
        fun validateMeasurements(measurements: WoundMeasurements): List<String> {
            val errors = mutableListOf<String>()
            
            if (measurements.length <= 0) {
                errors.add("Length must be greater than 0")
            }
            if (measurements.width <= 0) {
                errors.add("Width must be greater than 0")
            }
            if (measurements.depth != null && measurements.depth <= 0) {
                errors.add("Depth must be greater than 0")
            }
            
            measurements.underminingLocations.forEach { undermining ->
                if (undermining.clockPosition !in 1..12) {
                    errors.add("Clock position must be between 1 and 12")
                }
                if (undermining.depth <= 0) {
                    errors.add("Undermining depth must be greater than 0")
                }
            }
            
            measurements.tunnelingLocations.forEach { tunneling ->
                if (tunneling.clockPosition !in 1..12) {
                    errors.add("Clock position must be between 1 and 12")
                }
                if (tunneling.length <= 0) {
                    errors.add("Tunneling length must be greater than 0")
                }
            }
            
            return errors
        }
    }
}