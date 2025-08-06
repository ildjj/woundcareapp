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
  Text,
  List,
  Chip,
  Searchbar,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PatientScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 72,
      diagnosis: 'Diabetes, Hypertension',
      activeWounds: 2,
      lastAssessment: '2024-01-15',
      status: 'Active',
      criticalWounds: 1,
    },
    {
      id: 2,
      name: 'Mary Johnson',
      age: 68,
      diagnosis: 'Pressure Ulcer',
      activeWounds: 1,
      lastAssessment: '2024-01-14',
      status: 'Healing',
      criticalWounds: 0,
    },
    {
      id: 3,
      name: 'Robert Davis',
      age: 75,
      diagnosis: 'Surgical Wound',
      activeWounds: 1,
      lastAssessment: '2024-01-13',
      status: 'Healing',
      criticalWounds: 0,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      age: 65,
      diagnosis: 'Venous Ulcer',
      activeWounds: 3,
      lastAssessment: '2024-01-12',
      status: 'Active',
      criticalWounds: 2,
    },
    {
      id: 5,
      name: 'Michael Brown',
      age: 70,
      diagnosis: 'Arterial Ulcer',
      activeWounds: 1,
      lastAssessment: '2024-01-11',
      status: 'Critical',
      criticalWounds: 1,
    },
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#2196F3';
      case 'healing':
        return '#4CAF50';
      case 'critical':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const handlePatientPress = (patient) => {
    navigation.navigate('PatientDetails', { patient });
  };

  const handleNewPatient = () => {
    Alert.alert('New Patient', 'Add new patient functionality would be implemented here.');
  };

  const handleAssessmentPress = (patient) => {
    navigation.navigate('Assessment', { patientId: patient.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Patients</Title>
        <Text style={styles.headerSubtitle}>Manage patient wound care</Text>
      </View>

      <Searchbar
        placeholder="Search patients..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView style={styles.scrollView}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="people" size={24} color="#2196F3" />
                <Text style={styles.statTitle}>Total Patients</Text>
              </View>
              <Text style={styles.statValue}>{patients.length}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="warning" size={24} color="#F44336" />
                <Text style={styles.statTitle}>Critical Cases</Text>
              </View>
              <Text style={styles.statValue}>
                {patients.filter(p => p.criticalWounds > 0).length}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Patient List */}
        <Card style={styles.patientListCard}>
          <Card.Content>
            <Title>Patient List</Title>
            {filteredPatients.map((patient) => (
              <List.Item
                key={patient.id}
                title={patient.name}
                description={`Age: ${patient.age} • ${patient.diagnosis}`}
                left={() => (
                  <View style={styles.patientAvatar}>
                    <Icon name="person" size={24} color="#666" />
                  </View>
                )}
                right={() => (
                  <View style={styles.patientStatus}>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(patient.status) }}
                      style={{ borderColor: getStatusColor(patient.status) }}
                    >
                      {patient.status}
                    </Chip>
                    {patient.criticalWounds > 0 && (
                      <Icon name="warning" size={16} color="#F44336" style={styles.criticalIcon} />
                    )}
                  </View>
                )}
                onPress={() => handlePatientPress(patient)}
                style={styles.patientItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Assessment')}
                style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                icon="assessment"
              >
                New Assessment
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('BWATAssessment')}
                style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                icon="medical-bag"
              >
                BWAT Tool
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Critical Patients Alert */}
        {patients.filter(p => p.criticalWounds > 0).length > 0 && (
          <Card style={styles.criticalCard}>
            <Card.Content>
              <Title style={{ color: '#F44336' }}>Critical Patients</Title>
              {patients
                .filter(p => p.criticalWounds > 0)
                .map((patient) => (
                  <List.Item
                    key={patient.id}
                    title={patient.name}
                    description={`${patient.criticalWounds} critical wound(s) requiring immediate attention`}
                    left={() => <List.Icon icon="warning" color="#F44336" />}
                    right={() => (
                      <Button
                        mode="contained"
                        onPress={() => handleAssessmentPress(patient)}
                        style={{ backgroundColor: '#F44336' }}
                        compact
                      >
                        Assess
                      </Button>
                    )}
                    onPress={() => handlePatientPress(patient)}
                  />
                ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNewPatient}
        label="New Patient"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  patientListCard: {
    marginBottom: 16,
    elevation: 2,
  },
  patientItem: {
    marginVertical: 4,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientStatus: {
    alignItems: 'flex-end',
  },
  criticalIcon: {
    marginTop: 4,
  },
  quickActionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  criticalCard: {
    marginBottom: 16,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PatientScreen;