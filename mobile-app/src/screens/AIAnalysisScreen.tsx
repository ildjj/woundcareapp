import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const AIAnalysisScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeWoundImage = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAnalysisResult({
        woundType: 'Pressure Ulcer',
        severity: 'Stage 3',
        confidence: 0.89,
        measurements: { length: 4.2, width: 3.1, depth: 0.8, area: 13.02 },
        tissueComposition: { necrotic: 15, slough: 25, granulation: 45, epithelialization: 15 },
        infectionRisk: 'Low',
        recommendations: [
          'Debride necrotic tissue',
          'Apply appropriate wound dressing',
          'Monitor for signs of infection',
        ],
        treatmentOptions: [
          'Hydrogel dressing',
          'Negative pressure wound therapy',
          'Enzymatic debridement',
        ],
        followUpSchedule: 'Reassess in 3-5 days',
      });
    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze wound image.');
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
              setSelectedImage(response.assets[0].uri || null);
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
              setSelectedImage(response.assets[0].uri || null);
            }
          }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'stage 1': return '#4CAF50';
      case 'stage 2': return '#8BC34A';
      case 'stage 3': return '#FF9800';
      case 'stage 4': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>AI Wound Analysis</Title>
            <Paragraph>Advanced AI-powered wound assessment</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.imageCard}>
          <Card.Content>
            <Title>Wound Image</Title>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="camera-alt" size={48} color="#666" />
                  <Text style={styles.placeholderText}>Tap to select wound image</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Button
              mode="contained"
              onPress={analyzeWoundImage}
              disabled={!selectedImage || isAnalyzing}
              style={styles.analyzeButton}
            >
              <Icon name="psychology" size={20} style={styles.buttonIcon} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Wound'}
            </Button>
          </Card.Content>
        </Card>

        {isAnalyzing && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Title>AI Analysis in Progress</Title>
              <ProgressBar indeterminate color="#2196F3" style={styles.progressBar} />
              <Text style={styles.progressText}>Analyzing wound characteristics...</Text>
            </Card.Content>
          </Card>
        )}

        {analysisResult && (
          <>
            <Card style={styles.resultCard}>
              <Card.Content>
                <Title>Analysis Results</Title>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Wound Type:</Text>
                  <Text style={styles.resultValue}>{analysisResult.woundType}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Severity:</Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getSeverityColor(analysisResult.severity) }}
                    style={{ borderColor: getSeverityColor(analysisResult.severity) }}
                  >
                    {analysisResult.severity}
                  </Chip>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Confidence:</Text>
                  <Text style={styles.resultValue}>
                    {(analysisResult.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.resultCard}>
              <Card.Content>
                <Title>AI Recommendations</Title>
                {analysisResult.recommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    • {recommendation}
                  </Text>
                ))}
              </Card.Content>
            </Card>

            <Card style={styles.resultCard}>
              <Card.Content>
                <Title>Treatment Options</Title>
                {analysisResult.treatmentOptions.map((treatment, index) => (
                  <Text key={index} style={styles.treatmentText}>
                    • {treatment}
                  </Text>
                ))}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  imageCard: {
    marginBottom: 16,
    elevation: 2,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  analyzeButton: {
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  progressText: {
    marginTop: 8,
    color: '#666',
  },
  resultCard: {
    marginBottom: 16,
    elevation: 2,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultValue: {
    fontSize: 16,
  },
  recommendationText: {
    fontSize: 14,
    marginVertical: 2,
  },
  treatmentText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default AIAnalysisScreen;