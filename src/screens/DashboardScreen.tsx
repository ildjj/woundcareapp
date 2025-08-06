import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width;

interface DashboardData {
  activeAssessments: number;
  healingProgress: number;
  criticalCases: number;
  followUpsToday: number;
  recentAssessments: any[];
  woundTypeDistribution: any[];
  upcomingFollowUps: any[];
  aiInsights: any[];
  bwatAssessments: number;
  measureAssessments: number;
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
    aiInsights: [],
    bwatAssessments: 0,
    measureAssessments: 0,
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
          { id: 1, patientName: 'John Doe', woundType: 'Pressure Ulcer', date: '2024-01-15', severity: 'Moderate' },
          { id: 2, patientName: 'Jane Smith', woundType: 'Diabetic Ulcer', date: '2024-01-14', severity: 'Severe' },
          { id: 3, patientName: 'Mike Johnson', woundType: 'Surgical Wound', date: '2024-01-13', severity: 'Mild' },
        ],
        woundTypeDistribution: [
          { name: 'Pressure Ulcers', population: 45, color: '#FF6384' },
          { name: 'Diabetic Ulcers', population: 30, color: '#36A2EB' },
          { name: 'Surgical Wounds', population: 15, color: '#FFCE56' },
          { name: 'Other', population: 10, color: '#4BC0C0' },
        ],
        upcomingFollowUps: [
          { id: 1, patientName: 'John Doe', date: '2024-01-16', time: '09:00', priority: 'High' },
          { id: 2, patientName: 'Jane Smith', date: '2024-01-16', time: '14:30', priority: 'Medium' },
        ],
        aiInsights: [
          { id: 1, type: 'warning', message: '3 patients showing signs of infection', icon: 'warning' },
          { id: 2, type: 'success', message: '5 wounds showing improved healing', icon: 'trending-up' },
          { id: 3, type: 'info', message: '2 patients due for BWAT reassessment', icon: 'assessment' },
        ],
        bwatAssessments: 8,
        measureAssessments: 5,
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

  const SummaryCard = ({ title, value, icon, color, subtitle, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, { borderLeftColor: color }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Icon name={icon} size={24} color={color} />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Text style={[styles.cardValue, { color }]}>{value}</Text>
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const AIInsightCard = ({ insight }: any) => (
    <Card style={[styles.insightCard, { borderLeftColor: insight.type === 'warning' ? '#f59e0b' : insight.type === 'success' ? '#10b981' : '#3b82f6' }]}>
      <Card.Content style={styles.insightContent}>
        <View style={styles.insightHeader}>
          <Icon 
            name={insight.icon} 
            size={20} 
            color={insight.type === 'warning' ? '#f59e0b' : insight.type === 'success' ? '#10b981' : '#3b82f6'} 
          />
          <Text style={styles.insightMessage}>{insight.message}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wound Care Dashboard</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Patient Management</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
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
          color="#10b981"
          onPress={() => navigation.navigate('Tracker')}
        />
        <SummaryCard
          title="Critical Cases"
          value={dashboardData.criticalCases}
          icon="warning"
          color="#f59e0b"
          onPress={() => Alert.alert('Critical Cases', 'View critical cases')}
        />
        <SummaryCard
          title="Today's Follow-ups"
          value={dashboardData.followUpsToday}
          icon="schedule"
          color="#8b5cf6"
          onPress={() => Alert.alert('Follow-ups', 'View today\'s follow-ups')}
        />
      </View>

      {/* AI Insights */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="psychology" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>AI Insights</Text>
          </View>
          {dashboardData.aiInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </Card.Content>
      </Card>

      {/* Assessment Tools */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="medical-services" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>Assessment Tools</Text>
          </View>
          <View style={styles.toolsContainer}>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('BWATAssessment')}
            >
              <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.toolGradient}>
                <Icon name="assessment" size={32} color="white" />
                <Text style={styles.toolTitle}>BWAT</Text>
                <Text style={styles.toolSubtitle}>Bates-Jensen Wound Assessment Tool</Text>
                <Text style={styles.toolCount}>{dashboardData.bwatAssessments} assessments</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => navigation.navigate('MeasureAssessment')}
            >
              <LinearGradient colors={['#10b981', '#059669']} style={styles.toolGradient}>
                <Icon name="straighten" size={32} color="white" />
                <Text style={styles.toolTitle}>MEASURE</Text>
                <Text style={styles.toolSubtitle}>Measurement & Evaluation Tool</Text>
                <Text style={styles.toolCount}>{dashboardData.measureAssessments} assessments</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Assessments */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="history" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>Recent Assessments</Text>
          </View>
          {dashboardData.recentAssessments.map((assessment) => (
            <TouchableOpacity key={assessment.id} style={styles.assessmentItem}>
              <View style={styles.assessmentInfo}>
                <Text style={styles.assessmentName}>{assessment.patientName}</Text>
                <Text style={styles.assessmentType}>{assessment.woundType}</Text>
                <Text style={styles.assessmentDate}>{assessment.date}</Text>
              </View>
              <Chip 
                mode="outlined" 
                textStyle={{ color: assessment.severity === 'Severe' ? '#dc2626' : assessment.severity === 'Moderate' ? '#f59e0b' : '#10b981' }}
              >
                {assessment.severity}
              </Chip>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Wound Type Distribution Chart */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="pie-chart" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>Wound Type Distribution</Text>
          </View>
          <PieChart
            data={dashboardData.woundTypeDistribution}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>

      {/* Upcoming Follow-ups */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="schedule" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>Upcoming Follow-ups</Text>
          </View>
          {dashboardData.upcomingFollowUps.map((followUp) => (
            <View key={followUp.id} style={styles.followUpItem}>
              <View style={styles.followUpInfo}>
                <Text style={styles.followUpName}>{followUp.patientName}</Text>
                <Text style={styles.followUpDateTime}>{followUp.date} at {followUp.time}</Text>
              </View>
              <Chip 
                mode="outlined" 
                textStyle={{ color: followUp.priority === 'High' ? '#dc2626' : '#f59e0b' }}
              >
                {followUp.priority}
              </Chip>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 10,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionCard: {
    margin: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  insightCard: {
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  insightContent: {
    padding: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightMessage: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  toolsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  toolCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  toolGradient: {
    padding: 20,
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  toolSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  toolCount: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
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
  assessmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  assessmentType: {
    fontSize: 14,
    color: '#6b7280',
  },
  assessmentDate: {
    fontSize: 12,
    color: '#9ca3af',
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
  followUpName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  followUpDateTime: {
    fontSize: 14,
    color: '#6b7280',
  },
});