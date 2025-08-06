package com.woundcare.assessment.domain.model

/**
 * Bates-Jensen Wound Assessment Tool (BWAT) Scoring Criteria
 * Based on clinical guidelines and research from Nancy Bates-Jensen
 */
object BWATScoringCriteria {
    
    data class ScoringCategory(
        val name: String,
        val description: String,
        val scores: Map<Int, String>,
        val clinicalGuidance: String
    )
    
    val SIZE_SCORING = ScoringCategory(
        name = "Size",
        description = "Length × Width in cm²",
        scores = mapOf(
            1 to "Length × width < 4 cm²",
            2 to "Length × width 4-16 cm²",
            3 to "Length × width 16.1-36 cm²",
            4 to "Length × width 36.1-80 cm²",
            5 to "Length × width > 80 cm²"
        ),
        clinicalGuidance = "Measure at widest points. Use consistent measurement technique."
    )
    
    val DEPTH_SCORING = ScoringCategory(
        name = "Depth",
        description = "Depth of wound bed",
        scores = mapOf(
            1 to "Non-blanchable erythema on intact skin",
            2 to "Partial thickness skin loss involving epidermis and/or dermis",
            3 to "Full thickness skin loss involving damage or necrosis of subcutaneous tissue; may extend down to but not through underlying fascia; and/or mixed partial and full thickness",
            4 to "Obscured by necrosis",
            5 to "Full thickness skin loss with extensive destruction, tissue necrosis, or damage to muscle, bone, or supporting structures"
        ),
        clinicalGuidance = "Assess deepest point. Consider undermining and tunneling."
    )
    
    val EDGES_SCORING = ScoringCategory(
        name = "Edges",
        description = "Wound edge characteristics",
        scores = mapOf(
            1 to "Indistinct, diffuse, none clearly visible",
            2 to "Distinct, outline clearly visible, attached, even with wound base",
            3 to "Well-defined, not attached to wound base",
            4 to "Well-defined, not attached to base, rolled under, thickened",
            5 to "Well-defined, fibrotic, scarred, or hyperkeratotic"
        ),
        clinicalGuidance = "Examine edge attachment and thickness. Note epithelial migration."
    )
    
    val UNDERMINING_SCORING = ScoringCategory(
        name = "Undermining",
        description = "Tissue destruction under intact skin at wound margins",
        scores = mapOf(
            1 to "None present",
            2 to "Undermining < 2 cm in any area",
            3 to "Undermining 2-4 cm involving < 50% wound margins",
            4 to "Undermining 2-4 cm involving ≥ 50% wound margins",
            5 to "Undermining > 4 cm or tunneling in any area"
        ),
        clinicalGuidance = "Use sterile probe. Measure deepest point. Note clock positions."
    )
    
    val NECROTIC_TISSUE_TYPE_SCORING = ScoringCategory(
        name = "Necrotic Tissue Type",
        description = "Type of necrotic tissue in wound bed",
        scores = mapOf(
            1 to "None visible",
            2 to "White/grey non-viable tissue and/or non-adherent yellow slough",
            3 to "Loosely adherent yellow slough",
            4 to "Adherent, soft, black eschar",
            5 to "Firmly adherent, hard, black eschar"
        ),
        clinicalGuidance = "Identify predominant tissue type. Consider debridement needs."
    )
    
    val NECROTIC_TISSUE_AMOUNT_SCORING = ScoringCategory(
        name = "Necrotic Tissue Amount",
        description = "Amount of necrotic tissue in wound bed",
        scores = mapOf(
            1 to "None visible",
            2 to "< 25% of wound bed covered",
            3 to "25% to 50% of wound bed covered",
            4 to "> 50% and < 75% of wound bed covered",
            5 to "75% to 100% of wound bed covered"
        ),
        clinicalGuidance = "Estimate percentage coverage. Consider serial debridement."
    )
    
    val EXUDATE_TYPE_SCORING = ScoringCategory(
        name = "Exudate Type",
        description = "Nature of wound drainage",
        scores = mapOf(
            1 to "None",
            2 to "Bloody",
            3 to "Serosanguineous: thin, watery, pale red/pink",
            4 to "Serous: thin, watery, clear",
            5 to "Purulent: thin or thick, opaque, tan/yellow, with or without odor"
        ),
        clinicalGuidance = "Document color, consistency, and odor. Consider infection risk."
    )
    
    val EXUDATE_AMOUNT_SCORING = ScoringCategory(
        name = "Exudate Amount",
        description = "Amount of wound drainage",
        scores = mapOf(
            1 to "None, dry wound",
            2 to "Scant, wound moist but no observable exudate",
            3 to "Small, wound moist, drainage covers < 25% of dressing",
            4 to "Moderate, wound moist, drainage covers 25% to 75% of dressing",
            5 to "Large, wound moist, drainage covers > 75% of dressing"
        ),
        clinicalGuidance = "Assess dressing saturation. Consider absorption capacity."
    )
    
    val SKIN_COLOR_SCORING = ScoringCategory(
        name = "Skin Color",
        description = "Surrounding skin color within 4cm of wound edge",
        scores = mapOf(
            1 to "Pink or normal for ethnic group",
            2 to "Bright red and/or blanches to touch",
            3 to "White or grey pallor or hypopigmented",
            4 to "Dark red or purple and/or non-blanchable",
            5 to "Black or hyperpigmented"
        ),
        clinicalGuidance = "Consider ethnic variations. Assess perfusion and inflammation."
    )
    
    val PERIPHERAL_TISSUE_EDEMA_SCORING = ScoringCategory(
        name = "Peripheral Tissue Edema",
        description = "Surrounding skin edema within 4cm of wound edge",
        scores = mapOf(
            1 to "No swelling or edema",
            2 to "Non-pitting edema extends < 4 cm around wound",
            3 to "Non-pitting edema extends ≥ 4 cm around wound",
            4 to "Pitting edema extends < 4 cm around wound",
            5 to "Crepitus and/or pitting edema extends ≥ 4 cm around wound"
        ),
        clinicalGuidance = "Test for pitting. Consider fluid management needs."
    )
    
    val PERIPHERAL_TISSUE_INDURATION_SCORING = ScoringCategory(
        name = "Peripheral Tissue Induration",
        description = "Surrounding skin induration within 4cm of wound edge",
        scores = mapOf(
            1 to "None present",
            2 to "Induration < 2 cm around wound",
            3 to "Induration 2-4 cm extending < 50% around wound",
            4 to "Induration 2-4 cm extending ≥ 50% around wound",
            5 to "Induration > 4 cm in any area around wound"
        ),
        clinicalGuidance = "Palpate surrounding tissue. May indicate infection or poor circulation."
    )
    
    val GRANULATION_TISSUE_SCORING = ScoringCategory(
        name = "Granulation Tissue",
        description = "Type and quality of granulation tissue in wound bed",
        scores = mapOf(
            1 to "Skin intact or partial thickness wound",
            2 to "Bright, beefy red; 75% to 100% of wound filled and/or tissue overgrowth",
            3 to "Bright, beefy red; < 75% and > 25% of wound filled",
            4 to "Pink, and/or dull, dusky red and/or fills ≤ 25% of wound",
            5 to "No granulation tissue present"
        ),
        clinicalGuidance = "Healthy granulation is beefy red and bleeds easily when touched."
    )
    
    val EPITHELIALIZATION_SCORING = ScoringCategory(
        name = "Epithelialization",
        description = "New pink or shiny tissue growing in from wound edges or superficial islands",
        scores = mapOf(
            1 to "100% wound covered, surface intact",
            2 to "75% to < 100% wound covered and/or epithelial tissue extends > 0.5cm into wound bed",
            3 to "50% to < 75% wound covered and/or epithelial tissue extends to < 0.5cm into wound bed",
            4 to "25% to < 50% wound covered",
            5 to "< 25% wound covered"
        ),
        clinicalGuidance = "Look for pink, shiny new tissue. Measure extent of coverage."
    )
    
    /**
     * All BWAT scoring categories in order
     */
    val ALL_CATEGORIES = listOf(
        SIZE_SCORING,
        DEPTH_SCORING,
        EDGES_SCORING,
        UNDERMINING_SCORING,
        NECROTIC_TISSUE_TYPE_SCORING,
        NECROTIC_TISSUE_AMOUNT_SCORING,
        EXUDATE_TYPE_SCORING,
        EXUDATE_AMOUNT_SCORING,
        SKIN_COLOR_SCORING,
        PERIPHERAL_TISSUE_EDEMA_SCORING,
        PERIPHERAL_TISSUE_INDURATION_SCORING,
        GRANULATION_TISSUE_SCORING,
        EPITHELIALIZATION_SCORING
    )
    
    /**
     * Calculate size score based on wound area
     */
    fun calculateSizeScore(lengthCm: Float, widthCm: Float): Int {
        val area = lengthCm * widthCm
        return when {
            area < 4f -> 1
            area <= 16f -> 2
            area <= 36f -> 3
            area <= 80f -> 4
            else -> 5
        }
    }
    
    /**
     * Interpret total BWAT score
     */
    fun interpretTotalScore(totalScore: Int): String {
        return when {
            totalScore in 13..20 -> "Tissue health: Excellent (Score: $totalScore)"
            totalScore in 21..30 -> "Tissue health: Good (Score: $totalScore)"
            totalScore in 31..40 -> "Tissue health: Fair (Score: $totalScore)"
            totalScore in 41..50 -> "Tissue health: Poor (Score: $totalScore)"
            totalScore in 51..60 -> "Tissue health: Very Poor (Score: $totalScore)"
            totalScore > 60 -> "Tissue health: Critical (Score: $totalScore)"
            else -> "Invalid score range (Score: $totalScore)"
        }
    }
    
    /**
     * Determine healing status based on score trend
     */
    fun determineHealingStatus(currentScore: Int, previousScore: Int?): String {
        return if (previousScore == null) {
            "Baseline"
        } else {
            val scoreDifference = currentScore - previousScore
            when {
                scoreDifference < -2 -> "Regenerating" // Score decreasing (improving)
                scoreDifference > 2 -> "Degenerating" // Score increasing (worsening)
                else -> "Stalled" // Minimal change
            }
        }
    }
    
    /**
     * Get clinical recommendations based on score
     */
    fun getClinicalRecommendations(totalScore: Int, individualScores: Map<String, Int>): List<String> {
        val recommendations = mutableListOf<String>()
        
        // Overall recommendations based on total score
        when {
            totalScore > 50 -> {
                recommendations.add("Consider comprehensive wound care evaluation")
                recommendations.add("Evaluate for underlying pathology")
                recommendations.add("Consider surgical consultation")
            }
            totalScore > 40 -> {
                recommendations.add("Intensify wound care interventions")
                recommendations.add("Evaluate nutrition and comorbidities")
                recommendations.add("Consider advanced therapies")
            }
            totalScore > 30 -> {
                recommendations.add("Continue current treatment with modifications")
                recommendations.add("Monitor for signs of infection")
            }
            else -> {
                recommendations.add("Continue current wound care regimen")
                recommendations.add("Maintain protective measures")
            }
        }
        
        // Specific recommendations based on individual scores
        individualScores.forEach { (category, score) ->
            when (category) {
                "necrotic_tissue_type", "necrotic_tissue_amount" -> {
                    if (score >= 3) recommendations.add("Consider debridement")
                }
                "exudate_type" -> {
                    if (score == 5) recommendations.add("Evaluate for infection")
                }
                "exudate_amount" -> {
                    if (score >= 4) recommendations.add("Consider more absorbent dressing")
                }
                "peripheral_tissue_edema", "peripheral_tissue_induration" -> {
                    if (score >= 4) recommendations.add("Evaluate circulation and manage edema")
                }
            }
        }
        
        return recommendations.distinct()
    }
    
    /**
     * Validate BWAT score inputs
     */
    fun validateScores(scores: Map<String, Int>): List<String> {
        val errors = mutableListOf<String>()
        
        scores.forEach { (category, score) ->
            if (score !in 1..5) {
                errors.add("$category score must be between 1 and 5")
            }
        }
        
        if (scores.size != 13) {
            errors.add("All 13 BWAT categories must be scored")
        }
        
        return errors
    }
}