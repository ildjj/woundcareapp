import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
  Checkbox,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any email/password combination
      if (email && password) {
        navigation.navigate('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality would be implemented here.',
      [{ text: 'OK' }]
    );
  };

  const handleDemoLogin = () => {
    setEmail('demo@woundcare.com');
    setPassword('demo123');
    handleLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="healing" size={64} color="#2196F3" />
            </View>
            <Title style={styles.title}>Wound Care Pro</Title>
            <Paragraph style={styles.subtitle}>
              AI-Powered Wound Assessment & Management
            </Paragraph>
          </View>

          {/* Login Form */}
          <Card style={styles.loginCard}>
            <Card.Content>
              <Title style={styles.loginTitle}>Sign In</Title>
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
              
              <View style={styles.rememberContainer}>
                <Checkbox.Item
                  label="Remember me"
                  status={rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setRememberMe(!rememberMe)}
                  labelStyle={styles.checkboxLabel}
                />
              </View>
              
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                icon="login"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleDemoLogin}
                style={styles.demoButton}
                icon="play-circle"
              >
                Try Demo
              </Button>
              
              <Button
                mode="text"
                onPress={handleForgotPassword}
                style={styles.forgotButton}
              >
                Forgot Password?
              </Button>
            </Card.Content>
          </Card>

          {/* Features Preview */}
          <Card style={styles.featuresCard}>
            <Card.Content>
              <Title style={styles.featuresTitle}>Key Features</Title>
              
              <View style={styles.featureItem}>
                <Icon name="assessment" size={24} color="#4CAF50" />
                <Text style={styles.featureText}>BWAT Assessment Tool</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Icon name="psychology" size={24} color="#2196F3" />
                <Text style={styles.featureText}>AI Wound Analysis</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Icon name="photo-library" size={24} color="#FF9800" />
                <Text style={styles.featureText}>Image Gallery</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Icon name="trending-up" size={24} color="#9C27B0" />
                <Text style={styles.featureText}>Progress Tracking</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  loginCard: {
    marginBottom: 24,
    elevation: 4,
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  rememberContainer: {
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 12,
  },
  demoButton: {
    marginBottom: 12,
  },
  forgotButton: {
    marginBottom: 8,
  },
  featuresCard: {
    marginBottom: 24,
    elevation: 2,
  },
  featuresTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoginScreen;