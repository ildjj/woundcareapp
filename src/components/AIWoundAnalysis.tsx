import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  Chip,
  ProgressBar,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

interface AIWoundAnalysisProps {
  isDisabled: boolean;
  woundImages?: string[];
  previousAssessments?: any[];
}

interface AIAnalysisResult {
  woundType: string;
  severity: string;
  infectionRisk: string;
  healingStage: string;
  recommendations: string[];
  confidence: number;
  bwatScore?: number;
  nextSteps: string[];
}

export default function AIWoundAnalysis({ isDisabled, woundImages, previousAssessments }: AIWoundAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult: AIAnalysisResult = {
        woundType: 'Pressure Ulcer',
        severity: 'Moderate',
        infectionRisk: 'Low',
        healingStage: 'Granulation Phase',
        recommendations: [
          'Continue current treatment protocol with appropriate dressings',
          'Monitor for signs of infection and tissue changes',
          'Ensure proper offloading for pressure relief',
          'Consider advanced wound care products if no improvement in 2 weeks'
        ],
        confidence: 85,
        bwatScore: 24,
        nextSteps: [
          'Continue current treatment protocol',
          'Monitor for signs of infection',
          'Schedule follow-up assessment in 1 week',
          'Consider specialist consultation if no improvement'
        ]
      };

      setAnalysisResult(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose image source',
      [
        {
          text: 'Camera',
          onPress: () => launchCamera({
            mediaType: 'photo',
            quality: 0.8,
          }, (response) => {
            if (response.assets && response.assets[0]) {
              setSelectedImages(prev => [...prev, response.assets[0].uri || '']);
            }
          }),
        },
        {
          text: 'Gallery',
          onPress: () => launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          }, (response) => {
            if (response.assets && response.assets[0]) {
              setSelectedImages(prev => [...prev, response.assets[0].uri || '']);
            }
          }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minimal': return '#059669';
      case 'Mild': return '#d97706';
      case 'Moderate': return '#ea580c';
      case 'Severe': return '#dc2626';
      case 'Very Severe': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#059669';
      case 'Moderate': return '#d97706';
      case 'High': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>
            <Icon name="psychology" size={20} color="#2563eb" />
            {' '}AI-Powered Wound Analysis
          </Title>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="info" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            AI analysis combines wound images, BWAT assessment, and clinical data to provide
            comprehensive wound analysis and treatment recommendations.
          </Text>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageHeader}>
            <View style={styles.imageInfo}>
              <Icon name="camera-alt" size={16} color="#6b7280" />
              <Text style={styles.imageText}>
                {selectedImages.length} images selected
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={handleImagePicker}
              disabled={isDisabled}
              icon="camera"
              style={styles.imageButton}
            >
              Add Image
            </Button>
          </View>

          {selectedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageItem}>
                  <View style={styles.imagePlaceholder}>
                    <Icon name="image" size={32} color="#9ca3af" />
                    <Text style={styles.imagePlaceholderText}>Image {index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.analysisSection}>
          <Button
            mode="contained"
            onPress={performAnalysis}
            disabled={isDisabled || isAnalyzing}
            loading={isAnalyzing}
            icon="psychology"
            style={styles.analyzeButton}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Wound'}
          </Button>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={16} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>AI is analyzing your wound data...</Text>
          </View>
        )}

        {analysisResult && (
          <ScrollView style={styles.resultContainer}>
            {/* Analysis Summary */}
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Icon name="description" size={16} color="#2563eb" />
                  <Text style={styles.summaryLabel}>Wound Type</Text>
                </View>
                <Text style={styles.summaryValue}>{analysisResult.woundType}</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Icon name="trending-up" size={16} color="#059669" />
                  <Text style={styles.summaryLabel}>Severity</Text>
                </View>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getSeverityColor(analysisResult.severity) }}
                  style={[styles.severityChip, { borderColor: getSeverityColor(analysisResult.severity) }]}
                >
                  {analysisResult.severity}
                </Chip>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Icon name="warning" size={16} color="#dc2626" />
                  <Text style={styles.summaryLabel}>Infection Risk</Text>
                </View>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getRiskColor(analysisResult.infectionRisk) }}
                  style={[styles.severityChip, { borderColor: getRiskColor(analysisResult.infectionRisk) }]}
                >
                  {analysisResult.infectionRisk}
                </Chip>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Icon name="healing" size={16} color="#7c3aed" />
                  <Text style={styles.summaryLabel}>Healing Stage</Text>
                </View>
                <Text style={styles.summaryValue}>{analysisResult.healingStage}</Text>
              </View>
            </View>

            {/* BWAT Integration */}
            {analysisResult.bwatScore !== undefined && (
              <View style={styles.bwatContainer}>
                <Title style={styles.bwatTitle}>BWAT Assessment Integration</Title>
                <View style={styles.bwatContent}>
                  <View style={styles.bwatScore}>
                    <Text style={styles.bwatScoreLabel}>Total Score:</Text>
                    <Text style={styles.bwatScoreValue}>{analysisResult.bwatScore}/65</Text>
                  </View>
                  <ProgressBar
                    progress={analysisResult.bwatScore / 65}
                    color="#2563eb"
                    style={styles.bwatProgress}
                  />
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getSeverityColor(analysisResult.severity) }}
                    style={[styles.severityChip, { borderColor: getSeverityColor(analysisResult.severity) }]}
                  >
                    {analysisResult.severity}
                  </Chip>
                </View>
              </View>
            )}

            {/* Treatment Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Title style={styles.recommendationsTitle}>AI Treatment Recommendations</Title>
                {analysisResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Icon name="check-circle" size={16} color="#059669" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Next Steps */}
            <View style={styles.nextStepsContainer}>
              <Title style={styles.nextStepsTitle}>Recommended Next Steps</Title>
              {analysisResult.nextSteps.map((step, index) => (
                <View key={index} style={styles.nextStepItem}>
                  <View style={styles.stepBullet} />
                  <Text style={styles.nextStepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Confidence Score */}
            <View style={styles.confidenceContainer}>
              <View style={styles.confidenceHeader}>
                <Text style={styles.confidenceLabel}>Analysis Confidence</Text>
                <Text style={styles.confidenceValue}>{analysisResult.confidence}%</Text>
              </View>
              <ProgressBar
                progress={analysisResult.confidence / 100}
                color="#2563eb"
                style={styles.confidenceProgress}
              />
            </View>
          </ScrollView>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  imageButton: {
    borderColor: '#2563eb',
  },
  imageList: {
    flexDirection: 'row',
  },
  imageItem: {
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  analysisSection: {
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#2563eb',
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  resultContainer: {
    maxHeight: 600,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  severityChip: {
    height: 24,
  },
  bwatContainer: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  bwatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e40af',
  },
  bwatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bwatScore: {
    marginRight: 12,
  },
  bwatScoreLabel: {
    fontSize: 12,
    color: '#1e40af',
  },
  bwatScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  bwatProgress: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    marginLeft: 8,
  },
  nextStepsContainer: {
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
    marginTop: 6,
    marginRight: 12,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  confidenceContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  confidenceProgress: {
    height: 8,
    borderRadius: 4,
  },
});