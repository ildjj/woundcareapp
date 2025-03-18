
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeHealingProgress(assessments: any[]) {
  try {
    const sortedAssessments = assessments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const firstAssessment = sortedAssessments[0];
    const latestAssessment = sortedAssessments[sortedAssessments.length - 1];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Analyze the wound healing progress between these assessments:
            Initial Assessment (${new Date(firstAssessment.createdAt).toLocaleDateString()}):
            - Size: ${firstAssessment.length}x${firstAssessment.width}x${firstAssessment.depth}cm
            - Tissue: Granulation ${firstAssessment.granulationTissue}%, Epithelialization ${firstAssessment.epithelializationTissue}%
            
            Latest Assessment (${new Date(latestAssessment.createdAt).toLocaleDateString()}):
            - Size: ${latestAssessment.length}x${latestAssessment.width}x${latestAssessment.depth}cm
            - Tissue: Granulation ${latestAssessment.granulationTissue}%, Epithelialization ${latestAssessment.epithelializationTissue}%
            
            Provide a brief analysis of healing progress and any concerns.`
        }
      ],
      max_tokens: 300,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze healing progress');
  }
}

export async function getTreatmentRecommendations(assessment: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Based on the following wound assessment, provide specific treatment recommendations:
            Wound Type: ${assessment.woundType}
            Stage: ${assessment.woundStage}
            Measurements: ${assessment.length}cm x ${assessment.width}cm x ${assessment.depth}cm
            Tissue Composition:
            - Necrotic: ${assessment.necroticTissue}%
            - Slough: ${assessment.sloughTissue}%
            - Granulation: ${assessment.granulationTissue}%
            - Epithelialization: ${assessment.epithelializationTissue}%
            NERDS Assessment: ${JSON.stringify(assessment.nerdsAssessment)}
            STONEES Assessment: ${JSON.stringify(assessment.stoneesAssessment)}
            `
        }
      ],
      max_tokens: 500,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI recommendation error:', error);
    throw new Error('Failed to generate treatment recommendations');
  }
}

export async function analyzeWoundImage(imageBase64: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this wound image and provide a clinical assessment including: wound type, tissue characteristics, signs of infection, and suggested treatment approach." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze wound image');
  }
}
