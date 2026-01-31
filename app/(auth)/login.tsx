import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // 1. useState ගන්න
import {
  ActivityIndicator // 2. ActivityIndicator (Loading Wheel) ගන්න
  ,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import COLORS from '../../constants/Colors';
import { loginUser } from '../../services/authService'; // ඔයාගේ auth path එක

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 3. Loading State එක හදනවා
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Login පටන් ගන්නකොට Loading true කරනවා
    setLoading(true);

    try {
      await loginUser(email, password);
      // සාර්ථක නම් Dashboard එකට
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      // හරියට ගියත්, වැරදුනත් අන්තිමට Loading නවත්තනවා
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 4. Button එක වෙනස් කරනවා */}
      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} // Load වෙනකොට පාට අඩු කරනවා
        onPress={handleLogin}
        disabled={loading} // Load වෙනකොට ඔබන්න බැරි කරනවා
      >
        {loading ? (
          // Load වෙනවා නම් කැරකෙන රවුම පෙන්නනවා
          <ActivityIndicator color="#000" />
        ) : (
          // නැත්නම් නිකන්ම Text එක
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#1C1C1E', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  
  button: { 
    backgroundColor: COLORS.primary, // Neon Green
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10,
    height: 55, // Button එකේ උස fix කරනවා (රවුම ආවම පොඩි නොවෙන්න)
    justifyContent: 'center'
  },
  
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#888', textAlign: 'center', marginTop: 20 },
});