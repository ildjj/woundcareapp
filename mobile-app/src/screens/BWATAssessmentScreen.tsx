import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  RadioButton,
  Checkbox,
  Text,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BWATScore {
  size: number;
  depth: number;
  edges: number;
  undermining: number;
  necroticTissueType: number;
  necroticTissueAmount: number;
  exudateType: number;
  exudateAmount: number;
  skinColor: number;
  peripheralTissueEdema: number;
  peripheralTissueInduration: number;
  granulationTissue: number;
  epithelialization: number;
}

const BWATAssessmentScreen = ({ navigation, route }) => {
  const [scores, setScores] = useState<BWATScore>({
    size: 0,
    depth: 0,
    edges: 0,
    undermining: 0,
    necroticTissueType: 0,
    necroticTissueAmount: 0,
    exudateType: 0,
    exudateAmount: 0,
    skinColor: 0,
    peripheralTissueEdema: 0,
    peripheralTissueInduration: 0,
    granulationTissue: 0,
    epithelialization: 0,
  });

  const [totalScore, setTotalScore] = useState(0);
  const [severity, setSeverity] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const bwatCategories = [
    {
      name: 'size',
      title: 'Size',
      description: 'Measure the longest length and width perpendicular to length',
      options: [
        { value: 1, label: '≤ 4 cm²', description: 'Small wound' },
        { value: 2, label: '4.1 - 16 cm²', description: 'Medium wound' },
        { value: 3, label: '16.1 - 36 cm²', description: 'Large wound' },
        { value: 4, label: '36.1 - 80 cm²', description: 'Very large wound' },
        { value: 5, label: '> 80 cm²', description: 'Extremely large wound' },
      ],
    },
    {
      name: 'depth',
      title: 'Depth',
      description: 'Measure the deepest part of the wound',
      options: [
        { value: 1, label: '0 cm', description: 'No depth' },
        { value: 2, label: '0.1 - 0.2 cm', description: 'Superficial' },
        { value: 3, label: '0.3 - 0.6 cm', description: 'Partial thickness' },
        { value: 4, label: '0.7 - 1.0 cm', description: 'Full thickness' },
        { value: 5, label: '> 1.0 cm', description: 'Deep tissue' },
      ],
    },
    {
      name: 'edges',
      title: 'Edges',
      description: 'Assess the wound edges',
      options: [
        { value: 1, label: 'Indistinct, diffuse', description: 'No clear edges' },
        { value: 2, label: 'Distinct, attached', description: 'Clear edges' },
        { value: 3, label: 'Well-defined, not attached', description: 'Defined edges' },
        { value: 4, label: 'Fibrotic, scarred', description: 'Hard edges' },
        { value: 5, label: 'Rolled under, thickened', description: 'Rolled edges' },
      ],
    },
    {
      name: 'undermining',
      title: 'Undermining',
      description: 'Check for tunneling under wound edges',
      options: [
        { value: 1, label: 'None', description: 'No undermining' },
        { value: 2, label: '< 2 cm', description: 'Minimal undermining' },
        { value: 3, label: '2 - 4 cm', description: 'Moderate undermining' },
        { value: 4, label: '> 4 cm', description: 'Significant undermining' },
        { value: 5, label: 'Undermining in > 50% of wound', description: 'Extensive undermining' },
      ],
    },
    {
      name: 'necroticTissueType',
      title: 'Necrotic Tissue Type',
      description: 'Assess the type of necrotic tissue present',
      options: [
        { value: 1, label: 'None', description: 'No necrotic tissue' },
        { value: 2, label: 'White/gray nonviable tissue', description: 'Slough' },
        { value: 3, label: 'Lightly adherent', description: 'Loosely attached' },
        { value: 4, label: 'Strongly adherent', description: 'Firmly attached' },
        { value: 5, label: 'Black necrotic tissue', description: 'Eschar' },
      ],
    },
    {
      name: 'necroticTissueAmount',
      title: 'Necrotic Tissue Amount',
      description: 'Estimate the percentage of wound covered by necrotic tissue',
      options: [
        { value: 1, label: 'None', description: '0%' },
        { value: 2, label: '< 25%', description: 'Minimal amount' },
        { value: 3, label: '25% - 50%', description: 'Moderate amount' },
        { value: 4, label: '50% - 75%', description: 'Significant amount' },
        { value: 5, label: '> 75%', description: 'Extensive amount' },
      ],
    },
    {
      name: 'exudateType',
      title: 'Exudate Type',
      description: 'Assess the type of wound drainage',
      options: [
        { value: 1, label: 'None', description: 'No exudate' },
        { value: 2, label: 'Bloody', description: 'Bloody drainage' },
        { value: 3, label: 'Serosanguineous', description: 'Blood-tinged serous' },
        { value: 4, label: 'Serous', description: 'Clear fluid' },
        { value: 5, label: 'Purulent', description: 'Pus-like drainage' },
      ],
    },
    {
      name: 'exudateAmount',
      title: 'Exudate Amount',
      description: 'Estimate the amount of wound drainage',
      options: [
        { value: 1, label: 'None', description: 'No drainage' },
        { value: 2, label: 'Scant', description: 'Minimal drainage' },
        { value: 3, label: 'Small', description: 'Light drainage' },
        { value: 4, label: 'Moderate', description: 'Moderate drainage' },
        { value: 5, label: 'Large', description: 'Heavy drainage' },
      ],
    },
    {
      name: 'skinColor',
      title: 'Skin Color',
      description: 'Assess the color of surrounding skin',
      options: [
        { value: 1, label: 'Normal', description: 'Healthy skin color' },
        { value: 2, label: 'Pink', description: 'Slightly reddened' },
        { value: 3, label: 'Bright red', description: 'Inflamed' },
        { value: 4, label: 'Dark red', description: 'Severely inflamed' },
        { value: 5, label: 'Purple/mottled', description: 'Compromised circulation' },
      ],
    },
    {
      name: 'peripheralTissueEdema',
      title: 'Peripheral Tissue Edema',
      description: 'Assess swelling around the wound',
      options: [
        { value: 1, label: 'None', description: 'No edema' },
        { value: 2, label: '< 1 cm', description: 'Minimal edema' },
        { value: 3, label: '1 - 3 cm', description: 'Moderate edema' },
        { value: 4, label: '3 - 5 cm', description: 'Significant edema' },
        { value: 5, label: '> 5 cm', description: 'Severe edema' },
      ],
    },
    {
      name: 'peripheralTissueInduration',
      title: 'Peripheral Tissue Induration',
      description: 'Assess tissue hardness around the wound',
      options: [
        { value: 1, label: 'None', description: 'No induration' },
        { value: 2, label: '< 1 cm', description: 'Minimal induration' },
        { value: 3, label: '1 - 2 cm', description: 'Moderate induration' },
        { value: 4, label: '2 - 4 cm', description: 'Significant induration' },
        { value: 5, label: '> 4 cm', description: 'Severe induration' },
      ],
    },
    {
      name: 'granulationTissue',
      title: 'Granulation Tissue',
      description: 'Assess the amount of healthy granulation tissue',
      options: [
        { value: 1, label: 'None', description: 'No granulation' },
        { value: 2, label: '< 25%', description: 'Minimal granulation' },
        { value: 3, label: '25% - 50%', description: 'Moderate granulation' },
        { value: 4, label: '50% - 75%', description: 'Good granulation' },
        { value: 5, label: '> 75%', description: 'Excellent granulation' },
      ],
    },
    {
      name: 'epithelialization',
      title: 'Epithelialization',
      description: 'Assess the amount of new epithelial tissue',
      options: [
        { value: 1, label: 'None', description: 'No epithelialization' },
        { value: 2, label: '< 25%', description: 'Minimal epithelialization' },
        { value: 3, label: '25% - 50%', description: 'Moderate epithelialization' },
        { value: 4, label: '50% - 75%', description: 'Good epithelialization' },
        { value: 5, label: '> 75%', description: 'Excellent epithelialization' },
      ],
    },
  ];

  useEffect(() => {
    calculateTotalScore();
  }, [scores]);

  const calculateTotalScore = () => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);
    
    // Determine severity based on total score
    if (total <= 13) {
      setSeverity('Minimal');
      setRecommendations('Wound shows good healing potential. Continue current treatment plan.');
    } else if (total <= 20) {
      setSeverity('Mild');
      setRecommendations('Wound requires monitoring. Consider adjusting treatment if no improvement.');
    } else if (total <= 30) {
      setSeverity('Moderate');
      setRecommendations('Wound needs aggressive treatment. Consider advanced wound care modalities.');
    } else if (total <= 40) {
      setSeverity('Severe');
      setRecommendations('Wound requires immediate intervention. Consider surgical consultation.');
    } else {
      setSeverity('Critical');
      setRecommendations('Wound is life-threatening. Immediate surgical intervention required.');
    }
  };

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSaveAssessment = () => {
    if (totalScore === 0) {
      Alert.alert('Incomplete Assessment', 'Please complete all assessment categories before saving.');
      return;
    }

    const assessmentData = {
      scores,
      totalScore,
      severity,
      recommendations,
      timestamp: new Date().toISOString(),
      patientId: route.params?.patientId || null,
    };

    // Save to local database
    // This would integrate with your database context
    Alert.alert(
      'Assessment Saved',
      `BWAT Score: ${totalScore}\nSeverity: ${severity}\n\nRecommendations:\n${recommendations}`,
      [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>BWAT Assessment</Title>
            <Paragraph>Bates-Jensen Wound Assessment Tool</Paragraph>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
              <Text style={[styles.severityText, { color: getSeverityColor(severity) }]}>
                Severity: {severity}
              </Text>
            </View>
            <ProgressBar 
              progress={totalScore / 65} 
              color={getSeverityColor(severity)}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {bwatCategories.map((category, index) => (
          <Card key={category.name} style={styles.categoryCard}>
            <Card.Content>
              <Title style={styles.categoryTitle}>
                {index + 1}. {category.title}
              </Title>
              <Paragraph style={styles.categoryDescription}>
                {category.description}
              </Paragraph>
              
              <RadioButton.Group
                onValueChange={(value) => handleScoreChange(category.name, parseInt(value))}
                value={scores[category.name as keyof BWATScore].toString()}
              >
                {category.options.map((option) => (
                  <View key={option.value} style={styles.optionContainer}>
                    <RadioButton.Item
                      label={option.label}
                      value={option.value.toString()}
                      labelStyle={styles.radioLabel}
                    />
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.recommendationsCard}>
          <Card.Content>
            <Title>AI Recommendations</Title>
            <Paragraph style={styles.recommendationsText}>{recommendations}</Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveAssessment}
            style={styles.saveButton}
            disabled={totalScore === 0}
          >
            <Icon name="save" size={20} style={styles.buttonIcon} />
            Save Assessment
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Minimal':
      return '#4CAF50';
    case 'Mild':
      return '#8BC34A';
    case 'Moderate':
      return '#FF9800';
    case 'Severe':
      return '#F44336';
    case 'Critical':
      return '#9C27B0';
    default:
      return '#2196F3';
  }
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
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  severityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  categoryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 14,
  },
  optionDescription: {
    fontSize: 12,
    color: '#888',
    marginLeft: 48,
    marginTop: -8,
  },
  recommendationsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  recommendationsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default BWATAssessmentScreen;