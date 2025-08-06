import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import AssessmentScreen from './src/screens/AssessmentScreen';
import BWATAssessmentScreen from './src/screens/BWATAssessmentScreen';
import PatientScreen from './src/screens/PatientScreen';
import HealingTrackerScreen from './src/screens/HealingTrackerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AuthScreen from './src/screens/AuthScreen';

// Import context providers
import { AuthProvider } from './src/contexts/AuthContext';
import { AssessmentProvider } from './src/contexts/AssessmentContext';
import { DatabaseProvider } from './src/contexts/DatabaseContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Assessment') {
            iconName = 'assessment';
          } else if (route.name === 'Patients') {
            iconName = 'people';
          } else if (route.name === 'Tracker') {
            iconName = 'trending-up';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
      <Tab.Screen name="Patients" component={PatientScreen} />
      <Tab.Screen name="Tracker" component={HealingTrackerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DatabaseProvider>
          <AuthProvider>
            <AssessmentProvider>
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Auth" component={AuthScreen} />
                  <Stack.Screen name="Main" component={TabNavigator} />
                  <Stack.Screen name="BWATAssessment" component={BWATAssessmentScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </AssessmentProvider>
          </AuthProvider>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
