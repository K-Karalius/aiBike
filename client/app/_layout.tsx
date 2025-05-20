import { RideProvider } from '@/contexts/RideContext';
import { UserProvider } from '@/contexts/UserContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <UserProvider>
        <RideProvider>
          <>
            <View style={{ height: insets.top, backgroundColor: '#000' }} />
            <StatusBar style="light" />

            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  paddingTop: 0,
                },
              }}
            >
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="index" />
            </Stack>
          </>
        </RideProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
