import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Title,
  List,
  Button,
  Divider,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataSync, setDataSync] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Auth'),
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Exporting all patient data...');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Import data from backup file');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all patient data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => Alert.alert('Data Cleared', 'All data has been cleared.'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your app preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>App Settings</Title>
            
            <List.Item
              title="Notifications"
              description="Receive alerts for follow-ups and assessments"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                  thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Auto Save"
              description="Automatically save assessment data"
              left={(props) => <List.Icon {...props} icon="content-save" />}
              right={() => (
                <Switch
                  value={autoSave}
                  onValueChange={setAutoSave}
                  trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                  thumbColor={autoSave ? '#ffffff' : '#f3f4f6'}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Dark Mode"
              description="Use dark theme for better visibility"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                  thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Biometric Authentication"
              description="Use fingerprint or face ID to unlock app"
              left={(props) => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                  thumbColor={biometricAuth ? '#ffffff' : '#f3f4f6'}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Data Sync"
              description="Sync data across devices"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={dataSync}
                  onValueChange={setDataSync}
                  trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                  thumbColor={dataSync ? '#ffffff' : '#f3f4f6'}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Assessment Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Assessment Settings</Title>
            
            <List.Item
              title="BWAT Assessment"
              description="Configure BWAT scoring preferences"
              left={(props) => <List.Icon {...props} icon="assessment" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('BWAT Settings', 'Configure BWAT assessment options')}
            />
            
            <Divider />
            
            <List.Item
              title="AI Analysis"
              description="Configure AI analysis settings"
              left={(props) => <List.Icon {...props} icon="psychology" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('AI Settings', 'Configure AI analysis options')}
            />
            
            <Divider />
            
            <List.Item
              title="Image Quality"
              description="Set image capture quality"
              left={(props) => <List.Icon {...props} icon="camera-alt" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Image Settings', 'Configure image capture settings')}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Data Management</Title>
            
            <List.Item
              title="Export Data"
              description="Export all patient data to file"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={handleExportData}
            />
            
            <Divider />
            
            <List.Item
              title="Import Data"
              description="Import data from backup file"
              left={(props) => <List.Icon {...props} icon="upload" />}
              onPress={handleImportData}
            />
            
            <Divider />
            
            <List.Item
              title="Clear All Data"
              description="Permanently delete all data"
              left={(props) => <List.Icon {...props} icon="delete" color="#dc2626" />}
              onPress={handleClearData}
            />
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>About</Title>
            
            <List.Item
              title="App Version"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            
            <Divider />
            
            <List.Item
              title="Terms of Service"
              description="Read our terms and conditions"
              left={(props) => <List.Icon {...props} icon="description" />}
              right={(props) => <List.Icon {...props} icon="open-in-new" />}
              onPress={() => Alert.alert('Terms', 'Open terms of service')}
            />
            
            <Divider />
            
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={(props) => <List.Icon {...props} icon="security" />}
              right={(props) => <List.Icon {...props} icon="open-in-new" />}
              onPress={() => Alert.alert('Privacy', 'Open privacy policy')}
            />
            
            <Divider />
            
            <List.Item
              title="Contact Support"
              description="Get help and support"
              left={(props) => <List.Icon {...props} icon="help" />}
              right={(props) => <List.Icon {...props} icon="open-in-new" />}
              onPress={() => Alert.alert('Support', 'Contact support team')}
            />
          </Card.Content>
        </Card>

        {/* Account */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account</Title>
            
            <List.Item
              title="Profile"
              description="Edit your profile information"
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Profile', 'Edit profile settings')}
            />
            
            <Divider />
            
            <List.Item
              title="Change Password"
              description="Update your password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Password', 'Change password')}
            />
            
            <Divider />
            
            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={(props) => <List.Icon {...props} icon="logout" color="#dc2626" />}
              onPress={handleLogout}
            />
          </Card.Content>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Icon name="healing" size={48} color="#2563eb" />
          <Text style={styles.appName}>Wound Care Pro</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            AI-Powered Wound Assessment & Management
          </Text>
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
    marginBottom: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});