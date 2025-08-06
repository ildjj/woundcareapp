import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BWATAssessmentProps {
  isDisabled: boolean;
}

interface BWATItem {
  name: string;
  description: string;
  options: { value: number; label: string; description: string }[];
}

const BWAT_ITEMS: BWATItem[] = [
  {
    name: 'size',
    description: 'Wound size in cm²',
    options: [
      { value: 1, label: '1', description: '≤ 4 cm²' },
      { value: 2, label: '2', description: '4.1-16 cm²' },
      { value: 3, label: '3', description: '16.1-36 cm²' },
      { value: 4, label: '4', description: '36.1-80 cm²' },
      { value: 5, label: '5', description: '> 80 cm²' }
    ]
  },
  {
    name: 'depth',
    description: 'Wound depth',
    options: [
      { value: 1, label: '1', description: 'No depth' },
      { value: 2, label: '2', description: 'Superficial' },
      { value: 3, label: '3', description: 'Partial thickness' },
      { value: 4, label: '4', description: 'Full thickness' },
      { value: 5, label: '5', description: 'Deep tissue injury' }
    ]
  },
  {
    name: 'edges',
    description: 'Wound edges',
    options: [
      { value: 1, label: '1', description: 'Indistinct, diffuse, none clearly visible' },
      { value: 2, label: '2', description: 'Distinct, attached, even with wound base' },
      { value: 3, label: '3', description: 'Well-defined, not attached to wound base' },
      { value: 4, label: '4', description: 'Well-defined, not attached to base, rolled under, thickened' },
      { value: 5, label: '5', description: 'Well-defined, fibrotic, scarred or retracted' }
    ]
  },
  {
    name: 'undermining',
    description: 'Undermining',
    options: [
      { value: 1, label: '1', description: 'None visible' },
      { value: 2, label: '2', description: '< 2 cm under 1 edge' },
      { value: 3, label: '3', description: '< 2 cm under 2 edges' },
      { value: 4, label: '4', description: '2-5 cm under 2 edges' },
      { value: 5, label: '5', description: '> 5 cm under 2 edges' }
    ]
  },
  {
    name: 'necroticTissueType',
    description: 'Necrotic tissue type',
    options: [
      { value: 1, label: '1', description: 'None visible' },
      { value: 2, label: '2', description: 'White/gray non-viable tissue' },
      { value: 3, label: '3', description: 'Yellow slough' },
      { value: 4, label: '4', description: 'Brown/black necrotic tissue' },
      { value: 5, label: '5', description: 'Eschar' }
    ]
  },
  {
    name: 'necroticTissueAmount',
    description: 'Necrotic tissue amount',
    options: [
      { value: 1, label: '1', description: 'None' },
      { value: 2, label: '2', description: '< 25%' },
      { value: 3, label: '3', description: '25-50%' },
      { value: 4, label: '4', description: '50-75%' },
      { value: 5, label: '5', description: '75-100%' }
    ]
  },
  {
    name: 'exudateType',
    description: 'Exudate type',
    options: [
      { value: 1, label: '1', description: 'None' },
      { value: 2, label: '2', description: 'Bloody' },
      { value: 3, label: '3', description: 'Serosanguineous' },
      { value: 4, label: '4', description: 'Serous' },
      { value: 5, label: '5', description: 'Purulent' }
    ]
  },
  {
    name: 'exudateAmount',
    description: 'Exudate amount',
    options: [
      { value: 1, label: '1', description: 'None' },
      { value: 2, label: '2', description: 'Scant' },
      { value: 3, label: '3', description: 'Small' },
      { value: 4, label: '4', description: 'Moderate' },
      { value: 5, label: '5', description: 'Large' }
    ]
  },
  {
    name: 'skinColor',
    description: 'Skin color surrounding wound',
    options: [
      { value: 1, label: '1', description: 'Normal for ethnicity' },
      { value: 2, label: '2', description: 'Pink to bright red' },
      { value: 3, label: '3', description: 'Bright red to deep red' },
      { value: 4, label: '4', description: 'Deep red to purple' },
      { value: 5, label: '5', description: 'Black' }
    ]
  },
  {
    name: 'peripheralEdema',
    description: 'Peripheral tissue edema',
    options: [
      { value: 1, label: '1', description: 'None' },
      { value: 2, label: '2', description: '≤ 1 cm around wound' },
      { value: 3, label: '3', description: '1-3 cm around wound' },
      { value: 4, label: '4', description: '3-5 cm around wound' },
      { value: 5, label: '5', description: '> 5 cm around wound' }
    ]
  },
  {
    name: 'peripheralInduration',
    description: 'Peripheral tissue induration',
    options: [
      { value: 1, label: '1', description: 'None' },
      { value: 2, label: '2', description: '≤ 1 cm around wound' },
      { value: 3, label: '3', description: '1-3 cm around wound' },
      { value: 4, label: '4', description: '3-5 cm around wound' },
      { value: 5, label: '5', description: '> 5 cm around wound' }
    ]
  },
  {
    name: 'granulationTissue',
    description: 'Granulation tissue',
    options: [
      { value: 1, label: '1', description: 'Bright, beefy red, 75-100% of wound bed' },
      { value: 2, label: '2', description: 'Bright, beefy red, 25-75% of wound bed' },
      { value: 3, label: '3', description: 'Bright, beefy red, < 25% of wound bed' },
      { value: 4, label: '4', description: 'Pink and/or dull, red, 25-75% of wound bed' },
      { value: 5, label: '5', description: 'Pink and/or dull, red, < 25% of wound bed' }
    ]
  },
  {
    name: 'epithelialization',
    description: 'Epithelialization',
    options: [
      { value: 1, label: '1', description: '100% of wound covered' },
      { value: 2, label: '2', description: '75-99% of wound covered' },
      { value: 3, label: '3', description: '50-74% of wound covered' },
      { value: 4, label: '4', description: '25-49% of wound covered' },
      { value: 5, label: '5', description: '< 25% of wound covered' }
    ]
  }
];

export default function BWATAssessment({ isDisabled }: BWATAssessmentProps) {
  const [bwatValues, setBwatValues] = useState<{ [key: string]: number }>({});

  // Calculate total BWAT score
  const totalScore = Object.values(bwatValues).reduce((sum, value) => sum + (value || 0), 0);

  // Determine severity level
  const getSeverityLevel = (score: number) => {
    if (score <= 13) return { level: 'Minimal', color: '#059669' };
    if (score <= 20) return { level: 'Mild', color: '#d97706' };
    if (score <= 30) return { level: 'Moderate', color: '#ea580c' };
    if (score <= 40) return { level: 'Severe', color: '#dc2626' };
    return { level: 'Very Severe', color: '#7c3aed' };
  };

  const severity = getSeverityLevel(totalScore);

  const handleValueChange = (itemName: string, value: number) => {
    setBwatValues(prev => ({
      ...prev,
      [itemName]: value,
    }));
  };

  const getCompletedItems = () => {
    return Object.keys(bwatValues).length;
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>BWAT Assessment</Title>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Total Score: {totalScore}</Text>
            <Chip
              mode="outlined"
              textStyle={{ color: severity.color }}
              style={[styles.severityChip, { borderColor: severity.color }]}
            >
              {severity.level}
            </Chip>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="info" size={16} color="#6b7280" />
          <Text style={styles.infoText}>
            The Bates-Jensen Wound Assessment Tool (BWAT) evaluates 13 wound characteristics.
            Total scores: ≤13 (Minimal), 14-20 (Mild), 21-30 (Moderate), 31-40 (Severe), >40 (Very Severe).
          </Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {BWAT_ITEMS.map((item) => (
            <View key={item.name} style={styles.itemContainer}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={bwatValues[item.name] || ''}
                  onValueChange={(value) => handleValueChange(item.name, value)}
                  enabled={!isDisabled}
                  style={styles.picker}
                >
                  <Picker.Item label="Select score" value="" />
                  {item.options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={`${option.label} - ${option.description}`}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.summaryContainer}>
          <Title style={styles.summaryTitle}>Assessment Summary</Title>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Score:</Text>
              <Text style={styles.summaryValue}>{totalScore}/65</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Severity Level:</Text>
              <Text style={[styles.summaryValue, { color: severity.color }]}>
                {severity.level}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Completion:</Text>
              <Text style={styles.summaryValue}>
                {getCompletedItems()}/13 items
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Status:</Text>
              <Text style={[
                styles.summaryValue,
                { color: getCompletedItems() === 13 ? '#059669' : '#d97706' }
              ]}>
                {getCompletedItems() === 13 ? 'Complete' : 'Incomplete'}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Completion Progress</Text>
            <ProgressBar
              progress={getCompletedItems() / 13}
              color="#2563eb"
              style={styles.progressBar}
            />
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  severityChip: {
    height: 24,
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
  scrollContainer: {
    maxHeight: 400,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
  },
  picker: {
    height: 50,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});