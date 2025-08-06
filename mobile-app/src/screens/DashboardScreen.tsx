import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Chip,
  List,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalPatients: 24,
    activeAssessments: 8,
    criticalCases: 3,
    healingProgress: 75,
  });

  const [recentAssessments, setRecentAssessments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      woundType: 'Pressure Ulcer',
      severity: 'Stage 3',
      date: '2024-01-15',
      status: 'Active',
    },
    {
      id: 2,
      patientName: 'Mary Johnson',
      woundType: 'Diabetic Ulcer',
      severity: 'Stage 2',
      date: '2024-01-14',
      status: 'Healing',
    },
    {
      id: 3,
      patientName: 'Robert Davis',
      woundType: 'Surgical Wound',
      severity: 'Stage 1',
      date: '2024-01-13',
      status: 'Healing',
    },
  ]);

  const [woundTypes, setWoundTypes] = useState([
    { name: 'Pressure Ulcers', percentage: 45, color: '#FF5722' },
    { name: 'Diabetic Ulcers', percentage: 30, color: '#2196F3' },
    { name: 'Surgical Wounds', percentage: 15, color: '#4CAF50' },
    { name: 'Trauma Wounds', percentage: 10, color: '#FF9800' },
  ]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#F44336';
      case 'healing':
        return '#4CAF50';
      case 'critical':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'stage 1':
        return '#4CAF50';
      case 'stage 2':
        return '#8BC34A';
      case 'stage 3':
        return '#FF9800';
      case 'stage 4':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Wound Care Dashboard</Title>
          <Text style={styles.headerSubtitle}>AI-Powered Assessment & Management</Text>
        </View>

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
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AI Analysis')}
                style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                icon="psychology"
              >
                AI Analysis
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="people" size={24} color="#2196F3" />
                <Text style={styles.statTitle}>Total Patients</Text>
              </View>
              <Text style={styles.statValue}>{stats.totalPatients}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="assessment" size={24} color="#4CAF50" />
                <Text style={styles.statTitle}>Active Assessments</Text>
              </View>
              <Text style={styles.statValue}>{stats.activeAssessments}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="warning" size={24} color="#F44336" />
                <Text style={styles.statTitle}>Critical Cases</Text>
              </View>
              <Text style={styles.statValue}>{stats.criticalCases}</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <View style={styles.statHeader}>
                <Icon name="trending-up" size={24} color="#FF9800" />
                <Text style={styles.statTitle}>Healing Progress</Text>
              </View>
              <Text style={styles.statValue}>{stats.healingProgress}%</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Healing Progress Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Healing Progress Trend</Title>
            <LineChart
              data={chartData}
              width={width - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2196F3',
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>

        {/* Wound Types Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Wound Types Distribution</Title>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={woundTypes.map((type, index) => ({
                  name: type.name,
                  population: type.percentage,
                  color: type.color,
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12,
                }))}
                width={width - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </Card.Content>
        </Card>

        {/* Recent Assessments */}
        <Card style={styles.recentCard}>
          <Card.Content>
            <Title>Recent Assessments</Title>
            {recentAssessments.map((assessment) => (
              <List.Item
                key={assessment.id}
                title={assessment.patientName}
                description={`${assessment.woundType} • ${assessment.date}`}
                left={() => <List.Icon icon="person" />}
                right={() => (
                  <View style={styles.assessmentRight}>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getSeverityColor(assessment.severity) }}
                      style={{ borderColor: getSeverityColor(assessment.severity) }}
                    >
                      {assessment.severity}
                    </Chip>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(assessment.status) }}
                      style={{ borderColor: getStatusColor(assessment.status) }}
                    >
                      {assessment.status}
                    </Chip>
                  </View>
                )}
                onPress={() => navigation.navigate('Assessment', { assessmentId: assessment.id })}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Critical Alerts */}
        <Card style={styles.alertsCard}>
          <Card.Content>
            <Title style={{ color: '#F44336' }}>Critical Alerts</Title>
            <List.Item
              title="John Smith - Pressure Ulcer"
              description="Wound showing signs of infection. Immediate attention required."
              left={() => <List.Icon icon="warning" color="#F44336" />}
              onPress={() => navigation.navigate('Assessment', { patientId: 1 })}
            />
            <List.Item
              title="Mary Johnson - Diabetic Ulcer"
              description="Healing progress stalled. Consider treatment adjustment."
              left={() => <List.Icon icon="warning" color="#FF9800" />}
              onPress={() => navigation.navigate('Assessment', { patientId: 2 })}
            />
          </Card.Content>
        </Card>
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
  header: {
    marginBottom: 16,
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
  quickActionsCard: {
    marginBottom: 16,
    elevation: 4,
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 8,
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
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  recentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  assessmentRight: {
    alignItems: 'flex-end',
  },
  alertsCard: {
    marginBottom: 16,
    elevation: 2,
  },
});

export default DashboardScreen;