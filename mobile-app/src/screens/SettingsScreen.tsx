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
  Switch,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: false,
    biometricAuth: false,
    dataSync: true,
    imageQuality: 'high',
    language: 'English',
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export functionality would be implemented here.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Data import functionality would be implemented here.');
  };

  const handleBackupSettings = () => {
    Alert.alert('Backup Settings', 'Settings backup functionality would be implemented here.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all patient data and assessments. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been cleared successfully.');
        }},
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Wound Care App',
      'AI-Powered Wound Assessment & Management\n\nVersion: 1.0.0\n\nFeatures:\n• BWAT Assessment Tool\n• AI Wound Analysis\n• Patient Management\n• Image Gallery\n• Progress Tracking',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* User Profile */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>User Profile</Title>
            <List.Item
              title="Dr. Sarah Johnson"
              description="Wound Care Specialist"
              left={() => <List.Icon icon="account-circle" />}
              right={() => <Button mode="outlined" compact>Edit</Button>}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>App Settings</Title>
            
            <List.Item
              title="Push Notifications"
              description="Receive alerts for critical cases"
              left={() => <List.Icon icon="notifications" />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => handleSettingChange('notifications', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Auto Save"
              description="Automatically save assessments"
              left={() => <List.Icon icon="save" />}
              right={() => (
                <Switch
                  value={settings.autoSave}
                  onValueChange={(value) => handleSettingChange('autoSave', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Dark Mode"
              description="Use dark theme"
              left={() => <List.Icon icon="brightness-4" />}
              right={() => (
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => handleSettingChange('darkMode', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Biometric Authentication"
              description="Use fingerprint or face ID"
              left={() => <List.Icon icon="fingerprint" />}
              right={() => (
                <Switch
                  value={settings.biometricAuth}
                  onValueChange={(value) => handleSettingChange('biometricAuth', value)}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Data Synchronization"
              description="Sync data across devices"
              left={() => <List.Icon icon="sync" />}
              right={() => (
                <Switch
                  value={settings.dataSync}
                  onValueChange={(value) => handleSettingChange('dataSync', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Image Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Image Settings</Title>
            
            <List.Item
              title="Image Quality"
              description={`Current: ${settings.imageQuality}`}
              left={() => <List.Icon icon="photo-camera" />}
              onPress={() => {
                Alert.alert(
                  'Image Quality',
                  'Select image quality for wound photos',
                  [
                    { text: 'Low', onPress: () => handleSettingChange('imageQuality', 'low') },
                    { text: 'Medium', onPress: () => handleSettingChange('imageQuality', 'medium') },
                    { text: 'High', onPress: () => handleSettingChange('imageQuality', 'high') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </Card.Content>
        </Card>

        {/* Language Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Language</Title>
            
            <List.Item
              title="App Language"
              description={`Current: ${settings.language}`}
              left={() => <List.Icon icon="language" />}
              onPress={() => {
                Alert.alert(
                  'Language',
                  'Select app language',
                  [
                    { text: 'English', onPress: () => handleSettingChange('language', 'English') },
                    { text: 'Spanish', onPress: () => handleSettingChange('language', 'Spanish') },
                    { text: 'French', onPress: () => handleSettingChange('language', 'French') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Data Management</Title>
            
            <List.Item
              title="Export Data"
              description="Export all patient data"
              left={() => <List.Icon icon="file-download" />}
              onPress={handleExportData}
            />
            
            <Divider />
            
            <List.Item
              title="Import Data"
              description="Import patient data from file"
              left={() => <List.Icon icon="file-upload" />}
              onPress={handleImportData}
            />
            
            <Divider />
            
            <List.Item
              title="Backup Settings"
              description="Backup app settings"
              left={() => <List.Icon icon="backup" />}
              onPress={handleBackupSettings}
            />
            
            <Divider />
            
            <List.Item
              title="Clear All Data"
              description="Delete all patient data"
              left={() => <List.Icon icon="delete-forever" color="#F44336" />}
              onPress={handleClearData}
              titleStyle={{ color: '#F44336' }}
            />
          </Card.Content>
        </Card>

        {/* Support & About */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Support & About</Title>
            
            <List.Item
              title="Help & Documentation"
              description="User guide and tutorials"
              left={() => <List.Icon icon="help" />}
              onPress={() => Alert.alert('Help', 'Help documentation would be displayed here.')}
            />
            
            <Divider />
            
            <List.Item
              title="Contact Support"
              description="Get help from support team"
              left={() => <List.Icon icon="support-agent" />}
              onPress={() => Alert.alert('Support', 'Contact support functionality would be implemented here.')}
            />
            
            <Divider />
            
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={() => <List.Icon icon="privacy-tip" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would be displayed here.')}
            />
            
            <Divider />
            
            <List.Item
              title="Terms of Service"
              description="Read our terms of service"
              left={() => <List.Icon icon="description" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service would be displayed here.')}
            />
            
            <Divider />
            
            <List.Item
              title="About"
              description="App information and version"
              left={() => <List.Icon icon="info" />}
              onPress={handleAbout}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={{ backgroundColor: '#F44336' }}
              icon="logout"
            >
              Logout
            </Button>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
});

export default SettingsScreen;