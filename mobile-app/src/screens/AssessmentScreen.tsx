import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
  RadioButton,
  Checkbox,
  Divider,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AssessmentScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    woundType: '',
    woundLocation: '',
    woundStage: '',
    length: '',
    width: '',
    depth: '',
    painLevel: '',
    exudateType: '',
    exudateAmount: '',
    tissueTypes: {
      necrotic: false,
      slough: false,
      granulation: false,
      epithelialization: false,
    },
    infectionSigns: {
      redness: false,
      swelling: false,
      warmth: false,
      odor: false,
      purulent: false,
    },
  });

  const woundTypes = [
    'Pressure Ulcer',
    'Diabetic Ulcer',
    'Surgical Wound',
    'Trauma Wound',
    'Venous Ulcer',
    'Arterial Ulcer',
    'Burns',
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

  const woundLocations = [
    'Sacrum',
    'Coccyx',
    'Heel',
    'Ankle',
    'Hip',
    'Elbow',
    'Shoulder',
    'Back',
    'Abdomen',
    'Other',
  ];

  const exudateTypes = [
    'None',
    'Serous',
    'Serosanguineous',
    'Sanguineous',
    'Purulent',
  ];

  const exudateAmounts = [
    'None',
    'Scant',
    'Small',
    'Moderate',
    'Large',
  ];

  const painLevels = [
    '0 - No Pain',
    '1-3 - Mild',
    '4-6 - Moderate',
    '7-9 - Severe',
    '10 - Worst Possible',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTissueTypeChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      tissueTypes: {
        ...prev.tissueTypes,
        [type]: value,
      },
    }));
  };

  const handleInfectionSignChange = (sign, value) => {
    setFormData(prev => ({
      ...prev,
      infectionSigns: {
        ...prev.infectionSigns,
        [sign]: value,
      },
    }));
  };

  const calculateArea = () => {
    const length = parseFloat(formData.length) || 0;
    const width = parseFloat(formData.width) || 0;
    return (length * width).toFixed(2);
  };

  const validateForm = () => {
    if (!formData.patientName) {
      Alert.alert('Error', 'Please enter patient name');
      return false;
    }
    if (!formData.woundType) {
      Alert.alert('Error', 'Please select wound type');
      return false;
    }
    if (!formData.woundLocation) {
      Alert.alert('Error', 'Please select wound location');
      return false;
    }
    if (!formData.woundStage) {
      Alert.alert('Error', 'Please select wound stage');
      return false;
    }
    return true;
  };

  const handleSaveAssessment = () => {
    if (!validateForm()) return;

    const assessmentData = {
      ...formData,
      area: calculateArea(),
      timestamp: new Date().toISOString(),
    };

    Alert.alert(
      'Assessment Saved',
      'Wound assessment has been saved successfully.',
      [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Patient Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Patient Information</Title>
            <TextInput
              label="Patient Name"
              value={formData.patientName}
              onChangeText={(text) => handleInputChange('patientName', text)}
              style={styles.input}
            />
            <TextInput
              label="Age"
              value={formData.patientAge}
              onChangeText={(text) => handleInputChange('patientAge', text)}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Wound Classification */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Wound Classification</Title>
            
            <Text style={styles.sectionTitle}>Wound Type</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('woundType', value)}
              value={formData.woundType}
            >
              {woundTypes.map((type) => (
                <RadioButton.Item
                  key={type}
                  label={type}
                  value={type}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Wound Location</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('woundLocation', value)}
              value={formData.woundLocation}
            >
              {woundLocations.map((location) => (
                <RadioButton.Item
                  key={location}
                  label={location}
                  value={location}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Wound Stage</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('woundStage', value)}
              value={formData.woundStage}
            >
              {woundStages.map((stage) => (
                <RadioButton.Item
                  key={stage}
                  label={stage}
                  value={stage}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Wound Measurements */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Wound Measurements (cm)</Title>
            <View style={styles.measurementsContainer}>
              <TextInput
                label="Length"
                value={formData.length}
                onChangeText={(text) => handleInputChange('length', text)}
                keyboardType="numeric"
                style={styles.measurementInput}
              />
              <TextInput
                label="Width"
                value={formData.width}
                onChangeText={(text) => handleInputChange('width', text)}
                keyboardType="numeric"
                style={styles.measurementInput}
              />
              <TextInput
                label="Depth"
                value={formData.depth}
                onChangeText={(text) => handleInputChange('depth', text)}
                keyboardType="numeric"
                style={styles.measurementInput}
              />
            </View>
            <View style={styles.areaContainer}>
              <Text style={styles.areaLabel}>Calculated Area:</Text>
              <Text style={styles.areaValue}>{calculateArea()} cm²</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Pain Assessment */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Pain Assessment</Title>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('painLevel', value)}
              value={formData.painLevel}
            >
              {painLevels.map((level) => (
                <RadioButton.Item
                  key={level}
                  label={level}
                  value={level}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Exudate Assessment */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Exudate Assessment</Title>
            
            <Text style={styles.sectionTitle}>Exudate Type</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('exudateType', value)}
              value={formData.exudateType}
            >
              {exudateTypes.map((type) => (
                <RadioButton.Item
                  key={type}
                  label={type}
                  value={type}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Exudate Amount</Text>
            <RadioButton.Group
              onValueChange={(value) => handleInputChange('exudateAmount', value)}
              value={formData.exudateAmount}
            >
              {exudateAmounts.map((amount) => (
                <RadioButton.Item
                  key={amount}
                  label={amount}
                  value={amount}
                  labelStyle={styles.radioLabel}
                />
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Tissue Types */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Tissue Types Present</Title>
            <View style={styles.checkboxContainer}>
              <Checkbox.Item
                label="Necrotic Tissue"
                status={formData.tissueTypes.necrotic ? 'checked' : 'unchecked'}
                onPress={() => handleTissueTypeChange('necrotic', !formData.tissueTypes.necrotic)}
              />
              <Checkbox.Item
                label="Slough"
                status={formData.tissueTypes.slough ? 'checked' : 'unchecked'}
                onPress={() => handleTissueTypeChange('slough', !formData.tissueTypes.slough)}
              />
              <Checkbox.Item
                label="Granulation Tissue"
                status={formData.tissueTypes.granulation ? 'checked' : 'unchecked'}
                onPress={() => handleTissueTypeChange('granulation', !formData.tissueTypes.granulation)}
              />
              <Checkbox.Item
                label="Epithelialization"
                status={formData.tissueTypes.epithelialization ? 'checked' : 'unchecked'}
                onPress={() => handleTissueTypeChange('epithelialization', !formData.tissueTypes.epithelialization)}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Infection Assessment */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Infection Assessment</Title>
            <Text style={styles.sectionSubtitle}>Signs of Infection</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox.Item
                label="Redness"
                status={formData.infectionSigns.redness ? 'checked' : 'unchecked'}
                onPress={() => handleInfectionSignChange('redness', !formData.infectionSigns.redness)}
              />
              <Checkbox.Item
                label="Swelling"
                status={formData.infectionSigns.swelling ? 'checked' : 'unchecked'}
                onPress={() => handleInfectionSignChange('swelling', !formData.infectionSigns.swelling)}
              />
              <Checkbox.Item
                label="Warmth"
                status={formData.infectionSigns.warmth ? 'checked' : 'unchecked'}
                onPress={() => handleInfectionSignChange('warmth', !formData.infectionSigns.warmth)}
              />
              <Checkbox.Item
                label="Odor"
                status={formData.infectionSigns.odor ? 'checked' : 'unchecked'}
                onPress={() => handleInfectionSignChange('odor', !formData.infectionSigns.odor)}
              />
              <Checkbox.Item
                label="Purulent Drainage"
                status={formData.infectionSigns.purulent ? 'checked' : 'unchecked'}
                onPress={() => handleInfectionSignChange('purulent', !formData.infectionSigns.purulent)}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveAssessment}
            style={styles.saveButton}
            icon="content-save"
          >
            Save Assessment
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('BWATAssessment')}
            style={styles.bwatButton}
            icon="medical-bag"
          >
            Use BWAT Tool
          </Button>
        </View>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  radioLabel: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  measurementInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  areaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  areaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  areaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  checkboxContainer: {
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  bwatButton: {
    marginBottom: 12,
  },
});

export default AssessmentScreen;