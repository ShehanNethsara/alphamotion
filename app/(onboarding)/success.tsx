import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/2.jpg')} 
          style={styles.successImage}
          resizeMode="cover" 
        />

              <Ionicons name="checkmark-circle" size={100} color="#CCFF00" /> 

      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ready to Fitness!</Text>
        <Text style={styles.subtitle}>
          Your account has been created successfully.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/(onboarding)/user-info')}
      >
        <Text style={styles.buttonText}>Start Setup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  imageContainer: { 
    marginBottom: 40, 
    alignItems: 'center', 
    
    
  },
  successImage: {
    width: 250,  
    height: 250,
    borderRadius: 125, 
    borderWidth: 4,  
    borderColor: '#CCFF00', 
    marginBottom: 10,
  },
  content: { 
    alignItems: 'center', 
    marginBottom: 50 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#888', 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#CCFF00', 
    paddingVertical: 15, 
    paddingHorizontal: 40, 
    borderRadius: 30, 
    width: '100%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});