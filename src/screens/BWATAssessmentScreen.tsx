import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BWATAssessment from '../components/BWATAssessment';

export default function BWATAssessmentScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="assessment" size={24} color="#2563eb" />
        <Text style={styles.headerTitle}>BWAT Assessment</Text>
        <Text style={styles.headerSubtitle}>
          Bates-Jensen Wound Assessment Tool
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>About BWAT</Title>
            <Text style={styles.infoText}>
              The Bates-Jensen Wound Assessment Tool (BWAT) is a comprehensive 
              wound assessment instrument that evaluates 13 wound characteristics 
              to provide a standardized method for wound assessment and monitoring.
            </Text>
            
            <View style={styles.bwatInfo}>
              <View style={styles.infoItem}>
                <Icon name="check-circle" size={16} color="#059669" />
                <Text style={styles.infoItemText}>13 assessment criteria</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" size={16} color="#059669" />
                <Text style={styles.infoItemText}>Standardized scoring system</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" size={16} color="#059669" />
                <Text style={styles.infoItemText}>Evidence-based tool</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="check-circle" size={16} color="#059669" />
                <Text style={styles.infoItemText}>Progress tracking</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <BWATAssessment isDisabled={false} />

        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            icon="save"
            style={styles.actionButton}
          >
            Save Assessment
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            icon="close"
            style={styles.actionButton}
          >
            Cancel
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  bwatInfo: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItemText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
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