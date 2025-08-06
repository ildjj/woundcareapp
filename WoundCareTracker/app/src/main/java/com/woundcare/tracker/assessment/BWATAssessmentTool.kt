package com.woundcare.tracker.assessment

/**
 * BWAT - Bates-Jensen Wound Assessment Tool
 * A comprehensive wound assessment tool that evaluates 13 wound characteristics
 * Each item is scored from 1 (best) to 5 (worst)
 * Total score range: 13-65
 */
class BWATAssessmentTool {
    
    data class BWATItem(
        val name: String,
        val description: String,
        val scores: List<ScoreOption>
    )
    
    data class ScoreOption(
        val score: Int,
        val description: String
    )
    
    companion object {
        fun getBWATItems(): List<BWATItem> {
            return listOf(
                BWATItem(
                    name = "Size",
                    description = "Length x width in cm²",
                    scores = listOf(
                        ScoreOption(1, "Length x width <4 cm²"),
                        ScoreOption(2, "Length x width 4-<16 cm²"),
                        ScoreOption(3, "Length x width 16.1-<36 cm²"),
                        ScoreOption(4, "Length x width 36.1-<80 cm²"),
                        ScoreOption(5, "Length x width >80 cm²")
                    )
                ),
                
                BWATItem(
                    name = "Depth",
                    description = "Deepest anatomical layer visible",
                    scores = listOf(
                        ScoreOption(1, "Non-blanchable erythema on intact skin"),
                        ScoreOption(2, "Partial thickness skin loss involving epidermis &/or dermis"),
                        ScoreOption(3, "Full thickness skin loss involving damage or necrosis of subcutaneous tissue"),
                        ScoreOption(4, "Obscured by necrosis"),
                        ScoreOption(5, "Full thickness skin loss with extensive destruction, tissue necrosis or damage to muscle, bone or supporting structures")
                    )
                ),
                
                BWATItem(
                    name = "Edges",
                    description = "Wound edge characteristics",
                    scores = listOf(
                        ScoreOption(1, "Indistinct, diffuse, none clearly visible"),
                        ScoreOption(2, "Distinct, outline clearly visible, attached, even with wound base"),
                        ScoreOption(3, "Well-defined, not attached to wound base"),
                        ScoreOption(4, "Well-defined, not attached to base, rolled under, thickened"),
                        ScoreOption(5, "Well-defined, fibrotic, scarred or hyperkeratotic")
                    )
                ),
                
                BWATItem(
                    name = "Undermining",
                    description = "Tissue destruction under intact skin",
                    scores = listOf(
                        ScoreOption(1, "None present"),
                        ScoreOption(2, "Undermining < 2 cm in any area"),
                        ScoreOption(3, "Undermining 2-4 cm involving < 50% wound margins"),
                        ScoreOption(4, "Undermining 2-4 cm involving > 50% wound margins"),
                        ScoreOption(5, "Undermining > 4 cm or tunneling in any area")
                    )
                ),
                
                BWATItem(
                    name = "Necrotic Tissue Type",
                    description = "Type of necrotic tissue present",
                    scores = listOf(
                        ScoreOption(1, "None visible"),
                        ScoreOption(2, "White/grey non-viable tissue &/or non-adherent yellow slough"),
                        ScoreOption(3, "Loosely adherent yellow slough"),
                        ScoreOption(4, "Adherent, soft, black eschar"),
                        ScoreOption(5, "Firmly adherent, hard, black eschar")
                    )
                ),
                
                BWATItem(
                    name = "Necrotic Tissue Amount",
                    description = "Amount of necrotic tissue",
                    scores = listOf(
                        ScoreOption(1, "None visible"),
                        ScoreOption(2, "< 25% of wound bed covered"),
                        ScoreOption(3, "25% to 50% of wound covered"),
                        ScoreOption(4, "> 50% and < 75% of wound covered"),
                        ScoreOption(5, "75% to 100% of wound covered")
                    )
                ),
                
                BWATItem(
                    name = "Exudate Type",
                    description = "Type of wound drainage",
                    scores = listOf(
                        ScoreOption(1, "None"),
                        ScoreOption(2, "Bloody"),
                        ScoreOption(3, "Serosanguineous: thin, watery, pale red/pink"),
                        ScoreOption(4, "Serous: thin, watery, clear"),
                        ScoreOption(5, "Purulent: thin or thick, opaque, tan/yellow, with or without odor")
                    )
                ),
                
                BWATItem(
                    name = "Exudate Amount",
                    description = "Amount of wound drainage",
                    scores = listOf(
                        ScoreOption(1, "None, dry wound"),
                        ScoreOption(2, "Scant, wound moist but no observable exudate"),
                        ScoreOption(3, "Small"),
                        ScoreOption(4, "Moderate"),
                        ScoreOption(5, "Large")
                    )
                ),
                
                BWATItem(
                    name = "Skin Color Surrounding Wound",
                    description = "Periwound skin color",
                    scores = listOf(
                        ScoreOption(1, "Pink or normal for ethnic group"),
                        ScoreOption(2, "Bright red &/or blanches to touch"),
                        ScoreOption(3, "White or grey pallor or hypopigmented"),
                        ScoreOption(4, "Dark red or purple &/or non-blanchable"),
                        ScoreOption(5, "Black or hyperpigmented")
                    )
                ),
                
                BWATItem(
                    name = "Peripheral Tissue Edema",
                    description = "Swelling around wound",
                    scores = listOf(
                        ScoreOption(1, "No swelling or edema"),
                        ScoreOption(2, "Non-pitting edema extends <4 cm around wound"),
                        ScoreOption(3, "Non-pitting edema extends >4 cm around wound"),
                        ScoreOption(4, "Pitting edema extends < 4 cm around wound"),
                        ScoreOption(5, "Crepitus and/or pitting edema extends >4 cm around wound")
                    )
                ),
                
                BWATItem(
                    name = "Peripheral Tissue Induration",
                    description = "Firmness of surrounding tissue",
                    scores = listOf(
                        ScoreOption(1, "None present"),
                        ScoreOption(2, "Induration, < 2 cm around wound"),
                        ScoreOption(3, "Induration 2-4 cm extending < 50% around wound"),
                        ScoreOption(4, "Induration 2-4 cm extending > 50% around wound"),
                        ScoreOption(5, "Induration > 4 cm in any area around wound")
                    )
                ),
                
                BWATItem(
                    name = "Granulation Tissue",
                    description = "Healthy tissue in wound bed",
                    scores = listOf(
                        ScoreOption(1, "Skin intact or partial thickness wound"),
                        ScoreOption(2, "Bright, beefy red; 75% to 100% of wound filled &/or tissue overgrowth"),
                        ScoreOption(3, "Bright, beefy red; < 75% & > 25% of wound filled"),
                        ScoreOption(4, "Pink, &/or dull, dusky red &/or fills < 25% of wound"),
                        ScoreOption(5, "No granulation tissue present")
                    )
                ),
                
                BWATItem(
                    name = "Epithelialization",
                    description = "New skin growth",
                    scores = listOf(
                        ScoreOption(1, "100% wound covered, surface intact"),
                        ScoreOption(2, "75% to <100% wound covered &/or epithelial tissue extends >0.5cm into wound bed"),
                        ScoreOption(3, "50% to <75% wound covered &/or epithelial tissue extends to <0.5cm into wound bed"),
                        ScoreOption(4, "25% to < 50% wound covered"),
                        ScoreOption(5, "< 25% wound covered")
                    )
                )
            )
        }
        
        fun calculateTotalScore(scores: Map<String, Int>): Int {
            return scores.values.sum()
        }
        
        fun getScoreInterpretation(totalScore: Int): String {
            return when (totalScore) {
                in 13..20 -> "Minimal wound severity - Healing wound"
                in 21..30 -> "Mild wound severity - Regenerating wound"
                in 31..40 -> "Moderate wound severity - Degenerating wound"
                in 41..50 -> "Severe wound severity - Significantly compromised wound"
                in 51..65 -> "Critical wound severity - Severely compromised wound"
                else -> "Invalid score"
            }
        }
        
        fun getRecommendations(totalScore: Int): List<String> {
            val recommendations = mutableListOf<String>()
            
            when (totalScore) {
                in 13..20 -> {
                    recommendations.add("Continue current treatment plan")
                    recommendations.add("Monitor for continued improvement")
                    recommendations.add("Consider reducing frequency of dressing changes")
                }
                in 21..30 -> {
                    recommendations.add("Maintain moist wound healing environment")
                    recommendations.add("Continue regular assessments")
                    recommendations.add("Address any barriers to healing")
                }
                in 31..40 -> {
                    recommendations.add("Re-evaluate treatment plan")
                    recommendations.add("Consider advanced wound therapies")
                    recommendations.add("Increase frequency of assessments")
                    recommendations.add("Address underlying factors affecting healing")
                }
                in 41..50 -> {
                    recommendations.add("Urgent re-evaluation of treatment needed")
                    recommendations.add("Consider referral to wound specialist")
                    recommendations.add("Evaluate for infection")
                    recommendations.add("Consider negative pressure wound therapy")
                }
                in 51..65 -> {
                    recommendations.add("Immediate specialist consultation required")
                    recommendations.add("Aggressive intervention needed")
                    recommendations.add("Consider hospitalization")
                    recommendations.add("Evaluate for systemic complications")
                }
            }
            
            return recommendations
        }
    }
}