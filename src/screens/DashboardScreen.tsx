import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface DashboardData {
  activeAssessments: number;
  healingProgress: number;
  criticalCases: number;
  followUpsToday: number;
  recentAssessments: any[];
  woundTypeDistribution: any[];
  upcomingFollowUps: any[];
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activeAssessments: 0,
    healingProgress: 0,
    criticalCases: 0,
    followUpsToday: 0,
    recentAssessments: [],
    woundTypeDistribution: [],
    upcomingFollowUps: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockData: DashboardData = {
        activeAssessments: 12,
        healingProgress: 78,
        criticalCases: 3,
        followUpsToday: 8,
        recentAssessments: [
          { id: 1, patientName: 'John Doe', woundType: 'Pressure Ulcer', date: '2024-01-15' },
          { id: 2, patientName: 'Jane Smith', woundType: 'Diabetic Ulcer', date: '2024-01-14' },
        ],
        woundTypeDistribution: [
          { name: 'Pressure Ulcers', population: 45, color: '#FF6384' },
          { name: 'Diabetic Ulcers', population: 30, color: '#36A2EB' },
          { name: 'Surgical Wounds', population: 15, color: '#FFCE56' },
          { name: 'Other', population: 10, color: '#4BC0C0' },
        ],
        upcomingFollowUps: [
          { id: 1, patientName: 'John Doe', date: '2024-01-16', time: '09:00' },
          { id: 2, patientName: 'Jane Smith', date: '2024-01-16', time: '14:30' },
        ],
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const SummaryCard = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, { borderLeftColor: color }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Icon name={icon} size={24} color={color} />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Text style={[styles.cardValue, { color }]}>{value}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wound Care Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Doctor</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <SummaryCard
          title="Active Assessments"
          value={dashboardData.activeAssessments}
          icon="assessment"
          color="#2563eb"
          onPress={() => navigation.navigate('Assessment')}
        />
        <SummaryCard
          title="Healing Progress"
          value={`${dashboardData.healingProgress}%`}
          icon="trending-up"
          color="#059669"
          onPress={() => navigation.navigate('Tracker')}
        />
        <SummaryCard
          title="Critical Cases"
          value={dashboardData.criticalCases}
          icon="warning"
          color="#dc2626"
          onPress={() => navigation.navigate('Patients')}
        />
        <SummaryCard
          title="Follow-ups Today"
          value={dashboardData.followUpsToday}
          icon="schedule"
          color="#7c3aed"
          onPress={() => navigation.navigate('Patients')}
        />
      </View>

      {/* Recent Assessments */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Assessments</Title>
          {dashboardData.recentAssessments.map((assessment) => (
            <View key={assessment.id} style={styles.assessmentItem}>
              <View style={styles.assessmentInfo}>
                <Text style={styles.patientName}>{assessment.patientName}</Text>
                <Text style={styles.woundType}>{assessment.woundType}</Text>
                <Text style={styles.assessmentDate}>{assessment.date}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#6b7280" />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Wound Type Distribution */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Wound Type Distribution</Title>
          <View style={styles.chartContainer}>
            <PieChart
              data={dashboardData.woundTypeDistribution}
              width={screenWidth - 80}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Upcoming Follow-ups */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Upcoming Follow-ups</Title>
          {dashboardData.upcomingFollowUps.map((followUp) => (
            <View key={followUp.id} style={styles.followUpItem}>
              <View style={styles.followUpInfo}>
                <Text style={styles.patientName}>{followUp.patientName}</Text>
                <Text style={styles.followUpDateTime}>
                  {followUp.date} at {followUp.time}
                </Text>
              </View>
              <Icon name="schedule" size={20} color="#059669" />
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
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
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionCard: {
    margin: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  assessmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  assessmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  woundType: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  assessmentDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  followUpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  followUpInfo: {
    flex: 1,
  },
  followUpDateTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});