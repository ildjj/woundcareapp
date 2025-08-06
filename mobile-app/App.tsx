import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import AssessmentScreen from './src/screens/AssessmentScreen';
import BWATAssessmentScreen from './src/screens/BWATAssessmentScreen';
import PatientScreen from './src/screens/PatientScreen';
import WoundGalleryScreen from './src/screens/WoundGalleryScreen';
import AIAnalysisScreen from './src/screens/AIAnalysisScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

// Import context providers
import { AuthProvider } from './src/contexts/AuthContext';
import { AssessmentProvider } from './src/contexts/AssessmentContext';
import { DatabaseProvider } from './src/contexts/DatabaseContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Assessment':
              iconName = 'assessment';
              break;
            case 'Patients':
              iconName = 'people';
              break;
            case 'Gallery':
              iconName = 'photo-library';
              break;
            case 'AI Analysis':
              iconName = 'psychology';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
      <Tab.Screen name="Patients" component={PatientScreen} />
      <Tab.Screen name="Gallery" component={WoundGalleryScreen} />
      <Tab.Screen name="AI Analysis" component={AIAnalysisScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Main stack navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="BWATAssessment" component={BWATAssessmentScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DatabaseProvider>
          <AuthProvider>
            <AssessmentProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </AssessmentProvider>
          </AuthProvider>
        </DatabaseProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}