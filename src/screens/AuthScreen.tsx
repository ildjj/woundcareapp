import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to main app
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="healing" size={64} color="#2563eb" />
          <Title style={styles.appTitle}>Wound Care Pro</Title>
          <Text style={styles.appSubtitle}>
            AI-Powered Wound Assessment & Management
          </Text>
        </View>

        <Card style={styles.authCard}>
          <Card.Content>
            <Title style={styles.authTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Title>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            
            {!isLogin && (
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
            )}
            
            <Button
              mode="contained"
              onPress={handleAuth}
              loading={isLoading}
              disabled={isLoading}
              style={styles.authButton}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              style={styles.switchContainer}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Key Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="assessment" size={20} color="#059669" />
              <Text style={styles.featureText}>BWAT Assessment Tool</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="psychology" size={20} color="#7c3aed" />
              <Text style={styles.featureText}>AI-Powered Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="trending-up" size={20} color="#2563eb" />
              <Text style={styles.featureText}>Progress Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="camera-alt" size={20} color="#dc2626" />
              <Text style={styles.featureText}>Image Analysis</Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  authCard: {
    elevation: 4,
    marginBottom: 30,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  authButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
  },
  switchContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#2563eb',
    fontSize: 14,
  },
  features: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    elevation: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 6,
  },
});