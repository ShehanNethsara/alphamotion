import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import COLORS from '../../constants/Colors';
import { registerUser } from '../../services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password, name);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Ionicons name="barbell" size={50} color={COLORS.primary} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Alpha Motion community</Text>
        </View>

        <View style={styles.inputContainer}>
          <InputField 
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
          <InputField 
            label="Email address"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputField 
            label="Password"
            placeholder="*******"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
          />
        </View>

        {/* Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
            {agreeTerms && <Ionicons name="checkmark" size={14} color="black" />}
          </View>
          <Text style={styles.checkboxText}>I agree to the Terms & Privacy Policy</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <PrimaryButton 
          title="Sign Up" 
          onPress={handleRegister} 
          isLoading={loading}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
  subtitle: { color: COLORS.gray, fontSize: 14, marginTop: 5 },
  inputContainer: { marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 30 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: COLORS.gray, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxText: { color: COLORS.gray, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  footerText: { color: COLORS.gray, fontSize: 14 },
  loginText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});