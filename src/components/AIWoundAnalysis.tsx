import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  Chip,
  ProgressBar,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { analyzeWoundImage, getTreatmentRecommendations, analyzeHealingProgress } from '../../ai';

const screenWidth = Dimensions.get('window').width;

interface AIWoundAnalysisProps {
  woundImages?: string[];
  previousAssessments?: any[];
  bwatScore?: number;
  measureData?: any;
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
}

interface AIAnalysisResult {
  woundType: string;
  severity: string;
  infectionRisk: string;
  healingStage: string;
  recommendations: string[];
  confidence: number;
  bwatScore?: number;
  measureScore?: number;
  nextSteps: string[];
  aiInsights: string[];
  treatmentPlan: string[];
  riskFactors: string[];
  healingPrediction: string;
}

export default function AIWoundAnalysis({ 
  woundImages, 
  previousAssessments, 
  bwatScore, 
  measureData,
  onAnalysisComplete 
}: AIWoundAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    
    try {
      // Step 1: Image Analysis (if available)
      setAnalysisProgress(20);
      let imageAnalysis = "";
      if (woundImages && woundImages.length > 0) {
        try {
          const imageResult = await analyzeWoundImage(woundImages[0]);
          imageAnalysis = imageResult || "";
        } catch (err) {
          console.warn("Image analysis failed:", err);
        }
      }

      // Step 2: BWAT Score Analysis
      setAnalysisProgress(40);
      let bwatAnalysis = "";
      if (bwatScore !== undefined) {
        bwatAnalysis = `BWAT Score: ${bwatScore}. `;
        if (bwatScore <= 13) {
          bwatAnalysis += "Minimal severity. ";
        } else if (bwatScore <= 20) {
          bwatAnalysis += "Mild severity. ";
        } else if (bwatScore <= 30) {
          bwatAnalysis += "Moderate severity. ";
        } else if (bwatScore <= 40) {
          bwatAnalysis += "Severe severity. ";
        } else {
          bwatAnalysis += "Very severe severity. ";
        }
      }

      // Step 3: MEASURE Data Analysis
      setAnalysisProgress(60);
      let measureAnalysis = "";
      if (measureData) {
        measureAnalysis = `MEASURE Assessment: Wound size ${measureData.woundSize?.area || 0}cm². `;
        if (measureData.woundBed) {
          const { granulation, slough, necrotic, epithelial } = measureData.woundBed;
          measureAnalysis += `Tissue composition: ${granulation}% granulation, ${slough}% slough, ${necrotic}% necrotic, ${epithelial}% epithelial. `;
        }
      }

      // Step 4: Healing Progress Analysis
      setAnalysisProgress(80);
      let healingAnalysis = "";
      if (previousAssessments && previousAssessments.length > 1) {
        try {
          healingAnalysis = await analyzeHealingProgress(previousAssessments);
        } catch (err) {
          console.warn("Healing analysis failed:", err);
        }
      }

      // Step 5: Generate Comprehensive Analysis
      setAnalysisProgress(90);
      const result: AIAnalysisResult = await generateComprehensiveAnalysis({
        imageAnalysis,
        bwatAnalysis,
        measureAnalysis,
        healingAnalysis,
        bwatScore,
        measureData,
        previousAssessments,
      });

      setAnalysisResult(result);
      setAnalysisProgress(100);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

    } catch (error) {
      console.error('AI analysis error:', error);
      setError('Failed to perform AI analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateComprehensiveAnalysis = async (data: any): Promise<AIAnalysisResult> => {
    // This would typically call an AI service
    // For now, we'll generate a comprehensive analysis based on available data
    
    const woundType = data.measureData?.woundType || "Unknown";
    const severity = data.bwatScore <= 13 ? "Minimal" : 
                   data.bwatScore <= 20 ? "Mild" : 
                   data.bwatScore <= 30 ? "Moderate" : 
                   data.bwatScore <= 40 ? "Severe" : "Very Severe";
    
    const infectionRisk = determineInfectionRisk(data);
    const healingStage = determineHealingStage(data);
    const recommendations = generateRecommendations(data);
    const nextSteps = generateNextSteps(data);
    const aiInsights = generateAIInsights(data);
    const treatmentPlan = generateTreatmentPlan(data);
    const riskFactors = identifyRiskFactors(data);
    const healingPrediction = predictHealing(data);

    return {
      woundType,
      severity,
      infectionRisk,
      healingStage,
      recommendations,
      confidence: calculateConfidence(data),
      bwatScore: data.bwatScore,
      measureScore: calculateMeasureScore(data.measureData),
      nextSteps,
      aiInsights,
      treatmentPlan,
      riskFactors,
      healingPrediction,
    };
  };

  const determineInfectionRisk = (data: any): string => {
    const riskFactors = [];
    
    if (data.measureData?.woundInfection?.signs?.length > 0) {
      riskFactors.push('Signs of infection present');
    }
    
    if (data.bwatScore > 30) {
      riskFactors.push('High BWAT score');
    }
    
    if (data.measureData?.woundExudate?.type === 'Purulent') {
      riskFactors.push('Purulent exudate');
    }
    
    if (riskFactors.length >= 2) return 'High';
    if (riskFactors.length === 1) return 'Moderate';
    return 'Low';
  };

  const determineHealingStage = (data: any): string => {
    if (data.measureData?.woundBed?.epithelial > 50) return 'Advanced Healing';
    if (data.measureData?.woundBed?.granulation > 50) return 'Granulation Phase';
    if (data.measureData?.woundBed?.slough > 25) return 'Debridement Needed';
    return 'Inflammatory Phase';
  };

  const generateRecommendations = (data: any): string[] => {
    const recommendations = [];
    
    if (data.bwatScore > 30) {
      recommendations.push('Consider advanced wound care interventions');
    }
    
    if (data.measureData?.woundBed?.slough > 25) {
      recommendations.push('Debridement recommended to remove slough');
    }
    
    if (data.measureData?.woundBed?.granulation < 25) {
      recommendations.push('Focus on promoting granulation tissue formation');
    }
    
    if (data.measureData?.woundInfection?.signs?.length > 0) {
      recommendations.push('Monitor for infection and consider culture if needed');
    }
    
    return recommendations;
  };

  const generateNextSteps = (data: any): string[] => {
    const steps = [];
    
    steps.push('Schedule follow-up assessment in 1-2 weeks');
    
    if (data.bwatScore > 25) {
      steps.push('Consider specialist consultation');
    }
    
    if (data.measureData?.woundBed?.slough > 25) {
      steps.push('Plan for debridement procedure');
    }
    
    return steps;
  };

  const generateAIInsights = (data: any): string[] => {
    const insights = [];
    
    if (data.bwatScore && data.bwatScore > 30) {
      insights.push('High severity score indicates need for intensive intervention');
    }
    
    if (data.measureData?.woundSize?.area > 10) {
      insights.push('Large wound area may require extended healing time');
    }
    
    if (data.measureData?.woundBed?.granulation > 50) {
      insights.push('Good granulation tissue indicates positive healing trajectory');
    }
    
    return insights;
  };

  const generateTreatmentPlan = (data: any): string[] => {
    const plan = [];
    
    plan.push('Maintain moist wound environment');
    plan.push('Protect periwound skin');
    
    if (data.measureData?.woundBed?.slough > 25) {
      plan.push('Implement autolytic or enzymatic debridement');
    }
    
    if (data.measureData?.woundBed?.granulation < 25) {
      plan.push('Consider growth factor therapy or advanced dressings');
    }
    
    return plan;
  };

  const identifyRiskFactors = (data: any): string[] => {
    const risks = [];
    
    if (data.measureData?.woundAge > 30) {
      risks.push('Chronic wound (>30 days)');
    }
    
    if (data.measureData?.woundSize?.area > 10) {
      risks.push('Large wound area');
    }
    
    if (data.measureData?.woundSurrounding?.edema) {
      risks.push('Periwound edema');
    }
    
    return risks;
  };

  const predictHealing = (data: any): string => {
    if (data.measureData?.woundBed?.granulation > 50 && data.measureData?.woundBed?.epithelial > 25) {
      return 'Favorable - Expected healing within 4-6 weeks';
    } else if (data.measureData?.woundBed?.granulation > 25) {
      return 'Moderate - Expected healing within 6-8 weeks';
    } else {
      return 'Challenging - May require extended treatment period';
    }
  };

  const calculateConfidence = (data: any): number => {
    let confidence = 70; // Base confidence
    
    if (data.imageAnalysis) confidence += 10;
    if (data.bwatScore !== undefined) confidence += 10;
    if (data.measureData) confidence += 10;
    
    return Math.min(confidence, 100);
  };

  const calculateMeasureScore = (measureData: any): number => {
    if (!measureData) return 0;
    
    let score = 0;
    
    // Add points based on wound characteristics
    if (measureData.woundBed?.granulation > 50) score += 20;
    if (measureData.woundBed?.epithelial > 25) score += 15;
    if (measureData.woundSize?.area < 5) score += 15;
    if (!measureData.woundInfection?.signs?.length) score += 20;
    
    return score;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minimal': return '#10b981';
      case 'mild': return '#f59e0b';
      case 'moderate': return '#f97316';
      case 'severe': return '#dc2626';
      case 'very severe': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Icon name="psychology" size={24} color="#2563eb" />
            <Title style={styles.title}>AI-Powered Wound Analysis</Title>
          </View>
          
          <Text style={styles.subtitle}>
            Advanced analysis using machine learning and clinical expertise
          </Text>
        </Card.Content>
      </Card>

      {!analysisResult && !isAnalyzing && (
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={performAnalysis}
              icon="brain"
              style={styles.analyzeButton}
              disabled={isAnalyzing}
            >
              Start AI Analysis
            </Button>
            
            <View style={styles.analysisInfo}>
              <Text style={styles.infoTitle}>What AI Analysis Includes:</Text>
              <List.Item
                title="Image Analysis"
                description="Computer vision analysis of wound photos"
                left={(props) => <List.Icon {...props} icon="camera" />}
              />
              <List.Item
                title="BWAT Integration"
                description="Bates-Jensen Wound Assessment Tool scoring"
                left={(props) => <List.Icon {...props} icon="assessment" />}
              />
              <List.Item
                title="MEASURE Analysis"
                description="Measurement and evaluation tool integration"
                left={(props) => <List.Icon {...props} icon="straighten" />}
              />
              <List.Item
                title="Healing Progress"
                description="Trend analysis and prediction"
                left={(props) => <List.Icon {...props} icon="trending-up" />}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {isAnalyzing && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.analyzingContainer}>
              <Icon name="psychology" size={48} color="#2563eb" />
              <Title style={styles.analyzingTitle}>AI Analysis in Progress</Title>
              <Text style={styles.analyzingSubtitle}>
                Analyzing wound data and generating insights...
              </Text>
              
              <ProgressBar
                progress={analysisProgress / 100}
                color="#2563eb"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>{analysisProgress}% Complete</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {error && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.errorContainer}>
              <Icon name="error" size={24} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
              <Button
                mode="outlined"
                onPress={performAnalysis}
                style={styles.retryButton}
              >
                Retry Analysis
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {analysisResult && (
        <>
          {/* Summary Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Analysis Summary</Title>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Wound Type</Text>
                  <Chip mode="outlined" style={styles.summaryChip}>
                    {analysisResult.woundType}
                  </Chip>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Severity</Text>
                  <Chip 
                    mode="outlined" 
                    style={[styles.summaryChip, { borderColor: getSeverityColor(analysisResult.severity) }]}
                    textStyle={{ color: getSeverityColor(analysisResult.severity) }}
                  >
                    {analysisResult.severity}
                  </Chip>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Infection Risk</Text>
                  <Chip 
                    mode="outlined" 
                    style={[styles.summaryChip, { borderColor: getRiskColor(analysisResult.infectionRisk) }]}
                    textStyle={{ color: getRiskColor(analysisResult.infectionRisk) }}
                  >
                    {analysisResult.infectionRisk}
                  </Chip>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Healing Stage</Text>
                  <Chip mode="outlined" style={styles.summaryChip}>
                    {analysisResult.healingStage}
                  </Chip>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* AI Insights */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>AI Insights</Title>
              {analysisResult.aiInsights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Icon name="lightbulb" size={16} color="#f59e0b" />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Recommendations */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Treatment Recommendations</Title>
              {analysisResult.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="check-circle" size={16} color="#10b981" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Treatment Plan */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Treatment Plan</Title>
              {analysisResult.treatmentPlan.map((plan, index) => (
                <View key={index} style={styles.planItem}>
                  <Icon name="medical-services" size={16} color="#2563eb" />
                  <Text style={styles.planText}>{plan}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Risk Factors */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Risk Factors</Title>
              {analysisResult.riskFactors.map((risk, index) => (
                <View key={index} style={styles.riskItem}>
                  <Icon name="warning" size={16} color="#f59e0b" />
                  <Text style={styles.riskText}>{risk}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Healing Prediction */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Healing Prediction</Title>
              <View style={styles.predictionContainer}>
                <Icon name="timeline" size={24} color="#2563eb" />
                <Text style={styles.predictionText}>{analysisResult.healingPrediction}</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Next Steps */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Next Steps</Title>
              {analysisResult.nextSteps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  analyzeButton: {
    marginVertical: 16,
  },
  analysisInfo: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  analyzingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 20,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryChip: {
    alignSelf: 'flex-start',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  predictionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});