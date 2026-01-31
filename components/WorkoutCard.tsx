import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';

interface Props {
  title: string;
  duration: string;
  kcal: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

export default function WorkoutCard({ title, duration, kcal, onEdit, onDelete, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{duration} mins • {kcal} Kcal</Text>
      </View>
      
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  title: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  subtitle: { color: COLORS.gray, fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 5 },
});