

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORS from '../constants/Colors';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

export default function InputField({ 
  label, value, onChangeText, placeholder, isPassword = false, keyboardType = 'default' 
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { color: COLORS.text, fontSize: 14, marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
});