import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signOut } from 'firebase/auth'; // Firebase Auth එක ගන්න
import { getUserData } from '../../services/userService'; // Database එකෙන් විස්තර ගන්න
import COLORS from '../../constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // User Data සඳහා State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Data Load කරනවා (Login වෙන කෙනාගේ විස්තර)
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setEmail(user.email || 'No Email');
        setName(user.displayName || 'User');
        
        // Database එකෙනුත් විස්තර ගන්නවා (සමහර විට නම එතන තියෙන්න පුළුවන්)
        try {
          const dbData = await getUserData(user.uid);
          if (dbData && dbData.name) {
            setName(dbData.name);
          }
        } catch (error) {
          console.log("Error loading user data", error);
        }
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/(auth)/login'); 
            } catch (error) {
              Alert.alert("Error", "Failed to logout.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {/* User Image එක නැත්නම් Default එකක් පෙන්වන්න */}
            <Image 
              source={require('../../assets/images/1.jpg')} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#000" />
            </TouchableOpacity>
          </View>

          {/* 👇 මෙන්න මෙතන තමයි නම සහ Email එක පෙන්වන්නේ */}
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row (Static Data - මේවා පස්සේ Database එකට සම්බන්ධ කරන්න පුළුවන්) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>60 kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>21</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>165 cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>General</Text>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}><Ionicons name="person-outline" size={20} color="#fff" /></View>
              <Text style={styles.optionText}>Personal Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}><Ionicons name="notifications-outline" size={20} color="#fff" /></View>
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#333", true: COLORS.primary }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}><Ionicons name="lock-closed-outline" size={20} color="#fff" /></View>
              <Text style={styles.optionText}>Privacy & Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Other Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Other</Text>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}><Ionicons name="help-circle-outline" size={20} color="#fff" /></View>
              <Text style={styles.optionText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 59, 48, 0.15)' }]}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
              </View>
              <Text style={[styles.optionText, { color: COLORS.danger }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: COLORS.gray,
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#333',
  },

  // Settings Lists
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});