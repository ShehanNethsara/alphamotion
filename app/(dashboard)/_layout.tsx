import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import COLORS from '../../constants/Colors';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000', 
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
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="train" 
        options={{
          tabBarLabel: 'Train',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "flame" : "flame-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 55,
                height: 55,
                backgroundColor: COLORS.primary,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 25, 
                borderWidth: 4,
                borderColor: '#000', 
              }}
            >
              <Ionicons name="document-text" size={28} color="black" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="report" 
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile" 
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen name="workout-active" options={{ href: null }} />
    </Tabs>
  );
}