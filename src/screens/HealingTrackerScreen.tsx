import React, { useState, useEffect } from 'react';
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
  SegmentedButtons,
  ProgressBar,
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface HealingData {
  date: string;
  size: number;
  depth: number;
  bwatScore: number;
  tissueComposition: {
    necrotic: number;
    slough: number;
    granulation: number;
    epithelialization: number;
  };
}

interface Patient {
  id: string;
  name: string;
  woundType: string;
  startDate: string;
  healingData: HealingData[];
}

export default function HealingTrackerScreen() {
  const navigation = useNavigation();
  const [selectedPatient, setSelectedPatient] = useState<string>('1');
  const [timeRange, setTimeRange] = useState('30');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Mock data
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        woundType: 'Pressure Ulcer',
        startDate: '2024-01-01',
        healingData: [
          { date: '2024-01-01', size: 25, depth: 3, bwatScore: 35, tissueComposition: { necrotic: 30, slough: 40, granulation: 25, epithelialization: 5 } },
          { date: '2024-01-08', size: 20, depth: 2, bwatScore: 32, tissueComposition: { necrotic: 20, slough: 35, granulation: 35, epithelialization: 10 } },
          { date: '2024-01-15', size: 15, depth: 1, bwatScore: 28, tissueComposition: { necrotic: 10, slough: 25, granulation: 45, epithelialization: 20 } },
        ],
      },
      {
        id: '2',
        name: 'Jane Smith',
        woundType: 'Diabetic Ulcer',
        startDate: '2024-01-05',
        healingData: [
          { date: '2024-01-05', size: 18, depth: 2, bwatScore: 30, tissueComposition: { necrotic: 25, slough: 35, granulation: 30, epithelialization: 10 } },
          { date: '2024-01-12', size: 12, depth: 1, bwatScore: 25, tissueComposition: { necrotic: 15, slough: 25, granulation: 40, epithelialization: 20 } },
        ],
      },
    ];
    setPatients(mockPatients);
  }, []);

  const currentPatient = patients.find(p => p.id === selectedPatient);
  const healingData = currentPatient?.healingData || [];

  const chartData = {
    labels: healingData.map(d => d.date.split('-')[2]), // Extract day
    datasets: [
      {
        data: healingData.map(d => d.size),
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: healingData.map(d => d.bwatScore),
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const calculateHealingProgress = () => {
    if (healingData.length < 2) return 0;
    const first = healingData[0];
    const last = healingData[healingData.length - 1];
    const sizeReduction = ((first.size - last.size) / first.size) * 100;
    const bwatImprovement = ((first.bwatScore - last.bwatScore) / first.bwatScore) * 100;
    return (sizeReduction + bwatImprovement) / 2;
  };

  const getHealingStatus = (progress: number) => {
    if (progress >= 50) return { status: 'Excellent', color: '#059669' };
    if (progress >= 25) return { status: 'Good', color: '#d97706' };
    if (progress >= 10) return { status: 'Fair', color: '#ea580c' };
    return { status: 'Poor', color: '#dc2626' };
  };

  const progress = calculateHealingProgress();
  const status = getHealingStatus(progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Healing Tracker</Text>
        <Text style={styles.headerSubtitle}>Monitor wound healing progress</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Patient Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Select Patient</Title>
            <View style={styles.patientSelector}>
              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={[
                    styles.patientOption,
                    selectedPatient === patient.id && styles.selectedPatient,
                  ]}
                  onPress={() => setSelectedPatient(patient.id)}
                >
                  <Text style={[
                    styles.patientName,
                    selectedPatient === patient.id && styles.selectedPatientText,
                  ]}>
                    {patient.name}
                  </Text>
                  <Text style={[
                    styles.patientWoundType,
                    selectedPatient === patient.id && styles.selectedPatientText,
                  ]}>
                    {patient.woundType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Time Range Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Time Range</Title>
            <SegmentedButtons
              value={timeRange}
              onValueChange={setTimeRange}
              buttons={[
                { value: '7', label: '7 Days' },
                { value: '30', label: '30 Days' },
                { value: '90', label: '90 Days' },
              ]}
              style={styles.segmentedButton}
            />
          </Card.Content>
        </Card>

        {/* Healing Progress Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Healing Progress</Title>
            <View style={styles.progressContainer}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={[styles.progressValue, { color: status.color }]}>
                  {progress.toFixed(1)}%
                </Text>
                <ProgressBar
                  progress={progress / 100}
                  color={status.color}
                  style={styles.progressBar}
                />
                <Text style={[styles.progressStatus, { color: status.color }]}>
                  {status.status}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Healing Charts */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Healing Trends</Title>
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2563eb',
                },
              }}
              bezier
              style={styles.chart}
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2563eb' }]} />
                <Text style={styles.legendText}>Wound Size (cm²)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#dc2626' }]} />
                <Text style={styles.legendText}>BWAT Score</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tissue Composition */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Tissue Composition</Title>
            {healingData.length > 0 && (
              <View style={styles.tissueContainer}>
                {Object.entries(healingData[healingData.length - 1].tissueComposition).map(([type, percentage]) => (
                  <View key={type} style={styles.tissueItem}>
                    <Text style={styles.tissueLabel}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    <View style={styles.tissueBar}>
                      <View
                        style={[
                          styles.tissueFill,
                          { width: `${percentage}%` },
                          type === 'necrotic' && { backgroundColor: '#dc2626' },
                          type === 'slough' && { backgroundColor: '#f59e0b' },
                          type === 'granulation' && { backgroundColor: '#059669' },
                          type === 'epithelialization' && { backgroundColor: '#2563eb' },
                        ]}
                      />
                    </View>
                    <Text style={styles.tissuePercentage}>{percentage}%</Text>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Assessment History */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Assessment History</Title>
            {healingData.map((assessment, index) => (
              <View key={index} style={styles.assessmentItem}>
                <View style={styles.assessmentHeader}>
                  <Text style={styles.assessmentDate}>{assessment.date}</Text>
                  <Text style={styles.assessmentScore}>
                    BWAT: {assessment.bwatScore}
                  </Text>
                </View>
                <View style={styles.assessmentDetails}>
                  <Text style={styles.assessmentDetail}>
                    Size: {assessment.size} cm²
                  </Text>
                  <Text style={styles.assessmentDetail}>
                    Depth: {assessment.depth} cm
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Assessment')}
            icon="assessment"
            style={styles.actionButton}
          >
            New Assessment
          </Button>
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Export', 'Export healing data')}
            icon="download"
            style={styles.actionButton}
          >
            Export Data
          </Button>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  patientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  patientOption: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 120,
  },
  selectedPatient: {
    backgroundColor: '#2563eb',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedPatientText: {
    color: '#ffffff',
  },
  patientWoundType: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  segmentedButton: {
    marginBottom: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
    width: '100%',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tissueContainer: {
    marginTop: 8,
  },
  tissueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tissueLabel: {
    width: 100,
    fontSize: 14,
    color: '#374151',
  },
  tissueBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  tissueFill: {
    height: '100%',
    borderRadius: 4,
  },
  tissuePercentage: {
    width: 40,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  assessmentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  assessmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  assessmentScore: {
    fontSize: 14,
    color: '#6b7280',
  },
  assessmentDetails: {
    flexDirection: 'row',
  },
  assessmentDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});