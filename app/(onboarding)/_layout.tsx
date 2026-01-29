import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="success" />
      <Stack.Screen name="user-info" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="intro" />
    </Stack>
  );
}