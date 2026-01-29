import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

const COLORS = {
  primary: '#CCFF00', // Neon Yellow
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  gray: '#666666',
};

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000', // Tab Bar එක සම්පූර්ණ කළු
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -5,
        },
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 2. Train Tab (Flame Icon) */}
      <Tabs.Screen
        name="train" // මේ ෆයිල් එක හදන්න වෙයි (දැනට තියෙන history.tsx එක rename කරන්න පුළුවන්)
        options={{
          tabBarLabel: 'Train',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "flame" : "flame-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 3. Center Button (Yellow Circle) */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: '', // නමක් නෑ
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 55,
                height: 55,
                backgroundColor: COLORS.primary,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 25, // ටිකක් උඩට ගන්නවා
                borderWidth: 4,
                borderColor: '#000', // වටේට කළු ඉරක්
              }}
            >
              <Ionicons name="document-text" size={28} color="black" />
            </View>
          ),
        }}
      />

      {/* 4. Report Tab */}
      <Tabs.Screen
        name="report" // මේ ෆයිල් එකත් හදන්න වෙයි
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 5. Setting Tab */}
      <Tabs.Screen
        name="profile" // Profile එක Setting විදිහට පාවිච්චි කරමු
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
          ),
        }}
      />
      
      {/* Hidden Screens */}
      <Tabs.Screen name="workout-active" options={{ href: null }} />
      {/* ඔයාගේ පරණ file names තියෙනවා නම් ඒවා මේකට map කරන්න (උදා: history -> report) */}
    </Tabs>
  );
}