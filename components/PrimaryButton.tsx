import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../constants/Colors';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  style?: any;
}

export default function PrimaryButton({ title, onPress, isLoading, style }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.background} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 5,
  },
  text: {
    color: COLORS.background, 
    fontSize: 18,
    fontWeight: 'bold',
  },
});