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

import COLORS from '../../constants/Colors';
import { loginUser } from '../../services/authService';

// 👇 අලුත් Components Import කළා
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
      router.replace('/(dashboard)/home'); // Home එකට යවන්න (තාම home.tsx හැදුවේ නෑ, දැනට add හෝ train එකට යවන්නත් පුළුවන්)
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
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
        
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="barbell" size={60} color={COLORS.primary} />
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        {/* Google Button (මේක වෙනස් කළේ නෑ, මොකද මේක විශේෂ Button එකක්) */}
        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>

        {/* Inputs using Component */}
        <View style={styles.inputContainer}>
          <InputField 
            label="Email address"
            placeholder="tanya.hill@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <InputField 
            label="Password"
            placeholder="*******"
            value={password}
            onChangeText={setPassword}
            isPassword={true} // Password එකක් නිසා ඇස් අයිකනය එක්ක එනවා
          />
          
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 5 }}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button using Component */}
        <PrimaryButton 
          title="Login" 
          onPress={handleLogin} 
          isLoading={loading}
          style={{ marginBottom: 30, marginTop: 10 }}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an Account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333', paddingVertical: 15, borderRadius: 30, marginBottom: 30, backgroundColor: 'rgba(255,255,255,0.05)' },
  googleButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '500' },
  inputContainer: { marginBottom: 20 },
  forgotPassword: { color: COLORS.primary, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: COLORS.gray, fontSize: 14 },
  signupText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});