import { View, Text, StyleSheet } from 'react-native';

export default function TrainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Train Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#CCFF00', fontSize: 24, fontWeight: 'bold' }
});