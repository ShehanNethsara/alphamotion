import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Welcome Screen */}
      <Stack.Screen name="index" />
      
      {/* Login Screen */}
      <Stack.Screen name="login" />
      
      {/* Register Screen */}
      <Stack.Screen name="register" />
    </Stack>
  );
}