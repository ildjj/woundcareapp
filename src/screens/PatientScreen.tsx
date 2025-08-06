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
  TextInput,
  Button,
  Searchbar,
  FAB,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  woundType: string;
  lastAssessment: string;
  status: 'active' | 'healing' | 'critical' | 'completed';
  nextFollowUp: string;
}

export default function PatientScreen() {
  const navigation = useNavigation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Mock data
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 65,
        gender: 'Male',
        woundType: 'Pressure Ulcer',
        lastAssessment: '2024-01-15',
        status: 'active',
        nextFollowUp: '2024-01-20',
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 72,
        gender: 'Female',
        woundType: 'Diabetic Ulcer',
        lastAssessment: '2024-01-14',
        status: 'healing',
        nextFollowUp: '2024-01-18',
      },
      {
        id: '3',
        name: 'Robert Johnson',
        age: 58,
        gender: 'Male',
        woundType: 'Surgical Wound',
        lastAssessment: '2024-01-13',
        status: 'critical',
        nextFollowUp: '2024-01-16',
      },
      {
        id: '4',
        name: 'Mary Williams',
        age: 69,
        gender: 'Female',
        woundType: 'Venous Ulcer',
        lastAssessment: '2024-01-12',
        status: 'completed',
        nextFollowUp: '2024-01-25',
      },
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.woundType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#2563eb';
      case 'healing': return '#059669';
      case 'critical': return '#dc2626';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'healing': return 'Healing';
      case 'critical': return 'Critical';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const handleAddPatient = () => {
    Alert.alert('Add Patient', 'This would open a new patient form');
  };

  const handlePatientPress = (patient: Patient) => {
    Alert.alert(
      'Patient Options',
      `What would you like to do with ${patient.name}?`,
      [
        {
          text: 'New Assessment',
          onPress: () => navigation.navigate('Assessment'),
        },
        {
          text: 'View History',
          onPress: () => Alert.alert('History', 'View patient history'),
        },
        {
          text: 'Edit Patient',
          onPress: () => Alert.alert('Edit', 'Edit patient information'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patients</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPatients.length} of {patients.length} patients
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search patients..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={filterStatus === 'all'}
            onPress={() => setFilterStatus('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={filterStatus === 'active'}
            onPress={() => setFilterStatus('active')}
            style={styles.filterChip}
          >
            Active
          </Chip>
          <Chip
            selected={filterStatus === 'healing'}
            onPress={() => setFilterStatus('healing')}
            style={styles.filterChip}
          >
            Healing
          </Chip>
          <Chip
            selected={filterStatus === 'critical'}
            onPress={() => setFilterStatus('critical')}
            style={styles.filterChip}
          >
            Critical
          </Chip>
          <Chip
            selected={filterStatus === 'completed'}
            onPress={() => setFilterStatus('completed')}
            style={styles.filterChip}
          >
            Completed
          </Chip>
        </ScrollView>
      </View>

      <ScrollView style={styles.patientList}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            onPress={() => handlePatientPress(patient)}
          >
            <Card style={styles.patientCard}>
              <Card.Content>
                <View style={styles.patientHeader}>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>
                      {patient.age} years • {patient.gender}
                    </Text>
                  </View>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(patient.status) }}
                    style={[styles.statusChip, { borderColor: getStatusColor(patient.status) }]}
                  >
                    {getStatusText(patient.status)}
                  </Chip>
                </View>

                <View style={styles.patientDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="healing" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{patient.woundType}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="event" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Last: {patient.lastAssessment}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="schedule" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Next: {patient.nextFollowUp}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('Assessment')}
                    style={styles.actionButton}
                    icon="assessment"
                  >
                    Assess
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => Alert.alert('History', 'View patient history')}
                    style={styles.actionButton}
                    icon="history"
                  >
                    History
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddPatient}
      />
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f9fafb',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  filterChip: {
    marginRight: 8,
  },
  patientList: {
    flex: 1,
    padding: 16,
  },
  patientCard: {
    marginBottom: 12,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  patientDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statusChip: {
    height: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
  },
});