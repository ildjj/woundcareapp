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
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  Divider,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BWATAssessment from '../components/BWATAssessment';
import AIWoundAnalysis from '../components/AIWoundAnalysis';

interface AssessmentForm {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    medicalHistory: string;
  };
  woundClassification: {
    type: string;
    location: string;
    stage: string;
  };
  measurements: {
    length: string;
    width: string;
    depth: string;
    area: string;
  };
  woundBed: {
    necroticTissue: string;
    sloughTissue: string;
    granulationTissue: string;
    epithelializationTissue: string;
  };
  exudate: {
    type: string;
    amount: string;
    color: string;
  };
  pain: {
    level: string;
    type: string;
    frequency: string;
  };
  infection: {
    signs: string[];
    culture: string;
    antibiotics: string;
  };
  treatment: {
    current: string;
    frequency: string;
    dressing: string;
    notes: string;
  };
  images: string[];
  bwat: any;
}

export default function AssessmentScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<AssessmentForm>({
    patientInfo: {
      name: '',
      age: '',
      gender: '',
      medicalHistory: '',
    },
    woundClassification: {
      type: '',
      location: '',
      stage: '',
    },
    measurements: {
      length: '',
      width: '',
      depth: '',
      area: '',
    },
    woundBed: {
      necroticTissue: '',
      sloughTissue: '',
      granulationTissue: '',
      epithelializationTissue: '',
    },
    exudate: {
      type: '',
      amount: '',
      color: '',
    },
    pain: {
      level: '',
      type: '',
      frequency: '',
    },
    infection: {
      signs: [],
      culture: '',
      antibiotics: '',
    },
    treatment: {
      current: '',
      frequency: '',
      dressing: '',
      notes: '',
    },
    images: [],
    bwat: {},
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    'Patient Info',
    'Wound Classification',
    'Measurements',
    'Wound Bed',
    'Exudate & Pain',
    'Infection',
    'Treatment',
    'BWAT Assessment',
    'AI Analysis',
  ];

  const woundTypes = [
    'Pressure Ulcer',
    'Diabetic Ulcer',
    'Surgical Wound',
    'Trauma Wound',
    'Venous Ulcer',
    'Arterial Ulcer',
    'Other',
  ];

  const woundStages = [
    'Stage 1',
    'Stage 2',
    'Stage 3',
    'Stage 4',
    'Unstageable',
    'Deep Tissue Injury',
  ];

  const infectionSigns = [
    'Redness',
    'Swelling',
    'Heat',
    'Pain',
    'Purulent Drainage',
    'Foul Odor',
    'Delayed Healing',
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof AssessmentForm],
        [field]: value,
      },
    }));
  };

  const handleInfectionSignToggle = (sign: string) => {
    const currentSigns = formData.infection.signs;
    const newSigns = currentSigns.includes(sign)
      ? currentSigns.filter(s => s !== sign)
      : [...currentSigns, sign];
    
    handleInputChange('infection', 'signs', newSigns);
  };

  const calculateArea = () => {
    const length = parseFloat(formData.measurements.length) || 0;
    const width = parseFloat(formData.measurements.width) || 0;
    const area = (length * width).toFixed(2);
    handleInputChange('measurements', 'area', area);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Patient Info
        return formData.patientInfo.name && formData.patientInfo.age;
      case 1: // Wound Classification
        return formData.woundClassification.type && formData.woundClassification.location;
      case 2: // Measurements
        return formData.measurements.length && formData.measurements.width;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit assessment data
      console.log('Submitting assessment:', formData);
      Alert.alert('Success', 'Assessment saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Patient Information</Title>
              <TextInput
                label="Patient Name *"
                value={formData.patientInfo.name}
                onChangeText={(text) => handleInputChange('patientInfo', 'name', text)}
                style={styles.input}
              />
              <TextInput
                label="Age *"
                value={formData.patientInfo.age}
                onChangeText={(text) => handleInputChange('patientInfo', 'age', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.label}>Gender</Text>
              <SegmentedButtons
                value={formData.patientInfo.gender}
                onValueChange={(value) => handleInputChange('patientInfo', 'gender', value)}
                buttons={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                style={styles.segmentedButton}
              />
              <TextInput
                label="Medical History"
                value={formData.patientInfo.medicalHistory}
                onChangeText={(text) => handleInputChange('patientInfo', 'medicalHistory', text)}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        );

      case 1:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Wound Classification</Title>
              <Text style={styles.label}>Wound Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.woundClassification.type}
                  onValueChange={(value) => handleInputChange('woundClassification', 'type', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select wound type" value="" />
                  {woundTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                  ))}
                </Picker>
              </View>
              <TextInput
                label="Location *"
                value={formData.woundClassification.location}
                onChangeText={(text) => handleInputChange('woundClassification', 'location', text)}
                style={styles.input}
              />
              <Text style={styles.label}>Stage</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.woundClassification.stage}
                  onValueChange={(value) => handleInputChange('woundClassification', 'stage', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select stage" value="" />
                  {woundStages.map((stage) => (
                    <Picker.Item key={stage} label={stage} value={stage} />
                  ))}
                </Picker>
              </View>
            </Card.Content>
          </Card>
        );

      case 2:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Wound Measurements</Title>
              <View style={styles.measurementRow}>
                <TextInput
                  label="Length (cm) *"
                  value={formData.measurements.length}
                  onChangeText={(text) => handleInputChange('measurements', 'length', text)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  onBlur={calculateArea}
                />
                <TextInput
                  label="Width (cm) *"
                  value={formData.measurements.width}
                  onChangeText={(text) => handleInputChange('measurements', 'width', text)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  onBlur={calculateArea}
                />
              </View>
              <View style={styles.measurementRow}>
                <TextInput
                  label="Depth (cm)"
                  value={formData.measurements.depth}
                  onChangeText={(text) => handleInputChange('measurements', 'depth', text)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                />
                <TextInput
                  label="Area (cm²)"
                  value={formData.measurements.area}
                  editable={false}
                  style={[styles.input, styles.halfInput]}
                />
              </View>
            </Card.Content>
          </Card>
        );

      case 3:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Wound Bed Assessment</Title>
              <Text style={styles.label}>Tissue Types (must total 100%)</Text>
              <TextInput
                label="Necrotic Tissue (%)"
                value={formData.woundBed.necroticTissue}
                onChangeText={(text) => handleInputChange('woundBed', 'necroticTissue', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Slough Tissue (%)"
                value={formData.woundBed.sloughTissue}
                onChangeText={(text) => handleInputChange('woundBed', 'sloughTissue', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Granulation Tissue (%)"
                value={formData.woundBed.granulationTissue}
                onChangeText={(text) => handleInputChange('woundBed', 'granulationTissue', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Epithelialization (%)"
                value={formData.woundBed.epithelializationTissue}
                onChangeText={(text) => handleInputChange('woundBed', 'epithelializationTissue', text)}
                keyboardType="numeric"
                style={styles.input}
              />
            </Card.Content>
          </Card>
        );

      case 4:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Exudate & Pain Assessment</Title>
              <Text style={styles.label}>Exudate Type</Text>
              <SegmentedButtons
                value={formData.exudate.type}
                onValueChange={(value) => handleInputChange('exudate', 'type', value)}
                buttons={[
                  { value: 'none', label: 'None' },
                  { value: 'serous', label: 'Serous' },
                  { value: 'serosanguineous', label: 'Serosanguineous' },
                  { value: 'purulent', label: 'Purulent' },
                ]}
                style={styles.segmentedButton}
              />
              <Text style={styles.label}>Exudate Amount</Text>
              <SegmentedButtons
                value={formData.exudate.amount}
                onValueChange={(value) => handleInputChange('exudate', 'amount', value)}
                buttons={[
                  { value: 'none', label: 'None' },
                  { value: 'scant', label: 'Scant' },
                  { value: 'small', label: 'Small' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'large', label: 'Large' },
                ]}
                style={styles.segmentedButton}
              />
              <TextInput
                label="Pain Level (0-10)"
                value={formData.pain.level}
                onChangeText={(text) => handleInputChange('pain', 'level', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Pain Type"
                value={formData.pain.type}
                onChangeText={(text) => handleInputChange('pain', 'type', text)}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        );

      case 5:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Infection Assessment</Title>
              <Text style={styles.label}>Signs of Infection</Text>
              <View style={styles.chipContainer}>
                {infectionSigns.map((sign) => (
                  <Chip
                    key={sign}
                    selected={formData.infection.signs.includes(sign)}
                    onPress={() => handleInfectionSignToggle(sign)}
                    style={styles.chip}
                  >
                    {sign}
                  </Chip>
                ))}
              </View>
              <TextInput
                label="Culture Results"
                value={formData.infection.culture}
                onChangeText={(text) => handleInputChange('infection', 'culture', text)}
                multiline
                numberOfLines={2}
                style={styles.input}
              />
              <TextInput
                label="Current Antibiotics"
                value={formData.infection.antibiotics}
                onChangeText={(text) => handleInputChange('infection', 'antibiotics', text)}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        );

      case 6:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Treatment Plan</Title>
              <TextInput
                label="Current Treatment"
                value={formData.treatment.current}
                onChangeText={(text) => handleInputChange('treatment', 'current', text)}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
              <TextInput
                label="Frequency"
                value={formData.treatment.frequency}
                onChangeText={(text) => handleInputChange('treatment', 'frequency', text)}
                style={styles.input}
              />
              <TextInput
                label="Dressing Type"
                value={formData.treatment.dressing}
                onChangeText={(text) => handleInputChange('treatment', 'dressing', text)}
                style={styles.input}
              />
              <TextInput
                label="Treatment Notes"
                value={formData.treatment.notes}
                onChangeText={(text) => handleInputChange('treatment', 'notes', text)}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </Card.Content>
          </Card>
        );

      case 7:
        return <BWATAssessment isDisabled={false} />;

      case 8:
        return <AIWoundAnalysis isDisabled={false} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wound Assessment</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Steps */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.step,
              index === currentStep && styles.activeStep,
              index < currentStep && styles.completedStep,
            ]}
            onPress={() => setCurrentStep(index)}
          >
            <Text
              style={[
                styles.stepText,
                index === currentStep && styles.activeStepText,
                index < currentStep && styles.completedStepText,
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={prevStep}
          disabled={currentStep === 0}
          style={styles.footerButton}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            mode="contained"
            onPress={nextStep}
            style={styles.footerButton}
          >
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.footerButton}
          >
            Save Assessment
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  stepsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  step: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeStep: {
    backgroundColor: '#2563eb',
  },
  completedStep: {
    backgroundColor: '#059669',
  },
  stepText: {
    fontSize: 12,
    color: '#6b7280',
  },
  activeStepText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  completedStepText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});