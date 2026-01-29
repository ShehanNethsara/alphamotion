import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Circle & Image Container */}
      {/* Image එක දැන් තියෙන්නේ Circle එක ඇතුලේ */}
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Image
            source={require('../assets/images/1.jpg')}
            style={styles.image}
            resizeMode="cover" // රවුම සම්පූර්ණයෙන්ම වැහෙන්න 'cover' දැම්මා
          />
        </View>
      </View>

      {/* 2. Text & Button Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Transform Your Body, {'\n'}
          <Text style={styles.highlightText}>Transform</Text> Your Life
        </Text>

        <Text style={styles.subtitle}>
          Every workout brings you closer to a stronger, healthier version of yourself.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push('/login')} // Login එකට යවන්න
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
  // Circle එක සහ Image එක තියෙන තැන පාලනය කිරීම
  circleContainer: {
    position: 'absolute',
    top: height * 0.12, // උඩ සිට පහළට ඇති දුර
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // රවුම හැඩය
  circle: {
    width: width * 0.85, // රවුමේ ප්‍රමාණය
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2, // හරියටම රවුමක් වෙන්න නම් width එකෙන් බාගයක්
    backgroundColor: '#CCFF00',
    overflow: 'hidden', // වැදගත්ම දේ: මේකෙන් තමයි Image එක රවුම ඇතුලේ කොටු කරන්නේ
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // ඕන නම් පොඩි border එකක්
    borderColor: '#CCFF00',
  },

  // පින්තූරය
  image: {
    width: '100%',
    height: '100%',
  },

  // පහළ තියෙන Text සහ Button
  contentContainer: {
    width: '100%',
    paddingHorizontal: 25,
    paddingBottom: 50,
    zIndex: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 40,
  },
  highlightText: {
    color: '#CCFF00',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'left',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#CCFF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const Index = () => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    )
  }

  if (user) {
    return <Redirect href="/home" />
  } else {
    return <Redirect href="/login" />
  }
}

// export default Index