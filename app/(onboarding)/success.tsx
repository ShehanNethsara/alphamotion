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
      
      {/* මැද තියෙන රූපය Container එක */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/2.jpg')} // ඔයාගේ පින්තූරය
          style={styles.successImage}
          resizeMode="cover" // රවුම සම්පූර්ණයෙන්ම වැහෙන්න 'cover' දාන්න ඕන
        />

              <Ionicons name="checkmark-circle" size={100} color="#CCFF00" /> 

      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Ready to Fitness!</Text>
        <Text style={styles.subtitle}>
          Your account has been created successfully.
        </Text>
      </View>

      {/* Button */}
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
    marginBottom: 40, // පින්තූරේ ලොකු නිසා පරතරය වැඩි කළා
    alignItems: 'center', 
    
    // අවශ්‍ය නම් Image එකට Shadow එකක් දාන්න මේ ටික uncomment කරන්න:
    // shadowColor: "#CCFF00",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.5,
    // shadowRadius: 20,
    // elevation: 10,
  },
  successImage: {
    width: 250,  // 1. පින්තූරේ ලොකු කළා
    height: 250,
    borderRadius: 125, // 2. හරියටම රවුම් කළා (width එකෙන් භාගයක්)
    borderWidth: 4,    // 3. වටේට Border එකක් දැම්මා
    borderColor: '#CCFF00', // Neon Green පාට Border එක
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