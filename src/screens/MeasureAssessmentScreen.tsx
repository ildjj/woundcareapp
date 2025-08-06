import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  TextInput,
  RadioButton,
  Checkbox,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

interface MeasureAssessment {
  woundLocation: string;
  woundType: string;
  woundEtiology: string;
  woundAge: string;
  woundSize: {
    length: number;
    width: number;
    depth: number;
    area: number;
  };
  woundBed: {
    granulation: number;
    slough: number;
    necrotic: number;
    epithelial: number;
  };
  woundEdges: string;
  woundExudate: {
    type: string;
    amount: string;
  };
  woundInfection: {
    signs: string[];
    culture: boolean;
    antibiotics: boolean;
  };
  woundPain: {
    level: number;
    type: string;
  };
  woundOdor: string;
  woundTemperature: string;
  woundMoisture: string;
  woundSurrounding: {
    edema: boolean;
    induration: boolean;
    erythema: boolean;
    maceration: boolean;
  };
  woundTreatment: {
    current: string;
    recommendations: string[];
  };
  woundGoals: {
    shortTerm: string;
    longTerm: string;
  };
}

export default function MeasureAssessmentScreen() {
  const navigation = useNavigation();
  const [assessment, setAssessment] = useState<MeasureAssessment>({
    woundLocation: '',
    woundType: '',
    woundEtiology: '',
    woundAge: '',
    woundSize: {
      length: 0,
      width: 0,
      depth: 0,
      area: 0,
    },
    woundBed: {
      granulation: 0,
      slough: 0,
      necrotic: 0,
      epithelial: 0,
    },
    woundEdges: '',
    woundExudate: {
      type: '',
      amount: '',
    },
    woundInfection: {
      signs: [],
      culture: false,
      antibiotics: false,
    },
    woundPain: {
      level: 0,
      type: '',
    },
    woundOdor: '',
    woundTemperature: '',
    woundMoisture: '',
    woundSurrounding: {
      edema: false,
      induration: false,
      erythema: false,
      maceration: false,
    },
    woundTreatment: {
      current: '',
      recommendations: [],
    },
    woundGoals: {
      shortTerm: '',
      longTerm: '',
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const updateAssessment = (field: string, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parentField: string, childField: string, value: any) => {
    setAssessment(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof MeasureAssessment],
        [childField]: value,
      },
    }));
  };

  const calculateArea = () => {
    const area = assessment.woundSize.length * assessment.woundSize.width;
    updateNestedField('woundSize', 'area', area);
  };

  const calculateBedPercentages = () => {
    const total = assessment.woundBed.granulation + assessment.woundBed.slough + 
                  assessment.woundBed.necrotic + assessment.woundBed.epithelial;
    if (total > 100) {
      Alert.alert('Error', 'Tissue percentages cannot exceed 100%');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveAssessment = () => {
    if (calculateBedPercentages()) {
      Alert.alert(
        'Assessment Saved',
        'MEASURE assessment has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const renderStep1 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 1: Wound Identification</Title>
        
        <TextInput
          label="Wound Location"
          value={assessment.woundLocation}
          onChangeText={(text) => updateAssessment('woundLocation', text)}
          style={styles.input}
        />

        <TextInput
          label="Wound Type"
          value={assessment.woundType}
          onChangeText={(text) => updateAssessment('woundType', text)}
          style={styles.input}
        />

        <TextInput
          label="Wound Etiology"
          value={assessment.woundEtiology}
          onChangeText={(text) => updateAssessment('woundEtiology', text)}
          style={styles.input}
        />

        <TextInput
          label="Wound Age (days)"
          value={assessment.woundAge}
          onChangeText={(text) => updateAssessment('woundAge', text)}
          keyboardType="numeric"
          style={styles.input}
        />
      </Card.Content>
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 2: Wound Measurements</Title>
        
        <View style={styles.measurementContainer}>
          <TextInput
            label="Length (cm)"
            value={assessment.woundSize.length.toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              updateNestedField('woundSize', 'length', value);
              calculateArea();
            }}
            keyboardType="numeric"
            style={styles.measurementInput}
          />
          
          <TextInput
            label="Width (cm)"
            value={assessment.woundSize.width.toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              updateNestedField('woundSize', 'width', value);
              calculateArea();
            }}
            keyboardType="numeric"
            style={styles.measurementInput}
          />
        </View>

        <TextInput
          label="Depth (cm)"
          value={assessment.woundSize.depth.toString()}
          onChangeText={(text) => {
            const value = parseFloat(text) || 0;
            updateNestedField('woundSize', 'depth', value);
          }}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.areaDisplay}>
          <Text style={styles.areaLabel}>Calculated Area:</Text>
          <Text style={styles.areaValue}>{assessment.woundSize.area.toFixed(2)} cm²</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 3: Wound Bed Assessment</Title>
        
        <Text style={styles.sectionSubtitle}>Tissue Composition (%)</Text>
        
        <View style={styles.tissueContainer}>
          <TextInput
            label="Granulation Tissue"
            value={assessment.woundBed.granulation.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              updateNestedField('woundBed', 'granulation', value);
            }}
            keyboardType="numeric"
            style={styles.tissueInput}
          />
          
          <TextInput
            label="Slough"
            value={assessment.woundBed.slough.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              updateNestedField('woundBed', 'slough', value);
            }}
            keyboardType="numeric"
            style={styles.tissueInput}
          />
        </View>

        <View style={styles.tissueContainer}>
          <TextInput
            label="Necrotic Tissue"
            value={assessment.woundBed.necrotic.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              updateNestedField('woundBed', 'necrotic', value);
            }}
            keyboardType="numeric"
            style={styles.tissueInput}
          />
          
          <TextInput
            label="Epithelial Tissue"
            value={assessment.woundBed.epithelial.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              updateNestedField('woundBed', 'epithelial', value);
            }}
            keyboardType="numeric"
            style={styles.tissueInput}
          />
        </View>

        <Text style={styles.warningText}>
          * Total tissue percentages should equal 100%
        </Text>
      </Card.Content>
    </Card>
  );

  const renderStep4 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 4: Wound Characteristics</Title>
        
        <Text style={styles.sectionSubtitle}>Wound Edges</Text>
        <RadioButton.Group
          onValueChange={(value) => updateAssessment('woundEdges', value)}
          value={assessment.woundEdges}
        >
          <RadioButton.Item label="Attached" value="attached" />
          <RadioButton.Item label="Not Attached" value="not-attached" />
          <RadioButton.Item label="Fibrotic" value="fibrotic" />
          <RadioButton.Item label="Rolled" value="rolled" />
        </RadioButton.Group>

        <Text style={styles.sectionSubtitle}>Exudate</Text>
        <View style={styles.exudateContainer}>
          <TextInput
            label="Type"
            value={assessment.woundExudate.type}
            onChangeText={(text) => updateNestedField('woundExudate', 'type', text)}
            style={styles.exudateInput}
          />
          
          <TextInput
            label="Amount"
            value={assessment.woundExudate.amount}
            onChangeText={(text) => updateNestedField('woundExudate', 'amount', text)}
            style={styles.exudateInput}
          />
        </View>

        <Text style={styles.sectionSubtitle}>Infection Signs</Text>
        <View style={styles.checkboxContainer}>
          {['Redness', 'Swelling', 'Heat', 'Pain', 'Odor', 'Drainage'].map((sign) => (
            <Checkbox.Item
              key={sign}
              label={sign}
              status={assessment.woundInfection.signs.includes(sign) ? 'checked' : 'unchecked'}
              onPress={() => {
                const signs = assessment.woundInfection.signs.includes(sign)
                  ? assessment.woundInfection.signs.filter(s => s !== sign)
                  : [...assessment.woundInfection.signs, sign];
                updateNestedField('woundInfection', 'signs', signs);
              }}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderStep5 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 5: Surrounding Tissue</Title>
        
        <View style={styles.checkboxContainer}>
          <Checkbox.Item
            label="Edema"
            status={assessment.woundSurrounding.edema ? 'checked' : 'unchecked'}
            onPress={() => updateNestedField('woundSurrounding', 'edema', !assessment.woundSurrounding.edema)}
          />
          <Checkbox.Item
            label="Induration"
            status={assessment.woundSurrounding.induration ? 'checked' : 'unchecked'}
            onPress={() => updateNestedField('woundSurrounding', 'induration', !assessment.woundSurrounding.induration)}
          />
          <Checkbox.Item
            label="Erythema"
            status={assessment.woundSurrounding.erythema ? 'checked' : 'unchecked'}
            onPress={() => updateNestedField('woundSurrounding', 'erythema', !assessment.woundSurrounding.erythema)}
          />
          <Checkbox.Item
            label="Maceration"
            status={assessment.woundSurrounding.maceration ? 'checked' : 'unchecked'}
            onPress={() => updateNestedField('woundSurrounding', 'maceration', !assessment.woundSurrounding.maceration)}
          />
        </View>

        <Text style={styles.sectionSubtitle}>Pain Assessment</Text>
        <View style={styles.painContainer}>
          <Text>Pain Level (0-10): {assessment.woundPain.level}</Text>
          <View style={styles.sliderContainer}>
            {/* Add a slider component here */}
          </View>
        </View>

        <TextInput
          label="Pain Type"
          value={assessment.woundPain.type}
          onChangeText={(text) => updateNestedField('woundPain', 'type', text)}
          style={styles.input}
        />
      </Card.Content>
    </Card>
  );

  const renderStep6 = () => (
    <Card style={styles.stepCard}>
      <Card.Content>
        <Title style={styles.stepTitle}>Step 6: Treatment & Goals</Title>
        
        <TextInput
          label="Current Treatment"
          value={assessment.woundTreatment.current}
          onChangeText={(text) => updateNestedField('woundTreatment', 'current', text)}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Short-term Goals"
          value={assessment.woundGoals.shortTerm}
          onChangeText={(text) => updateNestedField('woundGoals', 'shortTerm', text)}
          multiline
          numberOfLines={2}
          style={styles.input}
        />

        <TextInput
          label="Long-term Goals"
          value={assessment.woundGoals.longTerm}
          onChangeText={(text) => updateNestedField('woundGoals', 'longTerm', text)}
          multiline
          numberOfLines={2}
          style={styles.input}
        />
      </Card.Content>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="straighten" size={24} color="#2563eb" />
        <Text style={styles.headerTitle}>MEASURE Assessment</Text>
        <Text style={styles.headerSubtitle}>
          Measurement & Evaluation Tool
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </LinearGradient>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {renderStepContent()}

        <View style={styles.actionContainer}>
          {currentStep > 1 && (
            <Button
              mode="outlined"
              onPress={prevStep}
              icon="arrow-left"
              style={styles.actionButton}
            >
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              mode="contained"
              onPress={nextStep}
              icon="arrow-right"
              style={styles.actionButton}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={saveAssessment}
              icon="save"
              style={styles.actionButton}
            >
              Save Assessment
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepCard: {
    marginBottom: 16,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  measurementContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  measurementInput: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  areaDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 8,
  },
  areaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  areaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  tissueContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tissueInput: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  warningText: {
    fontSize: 12,
    color: '#f59e0b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  exudateContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  exudateInput: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  checkboxContainer: {
    marginVertical: 8,
  },
  painContainer: {
    marginVertical: 16,
  },
  sliderContainer: {
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});