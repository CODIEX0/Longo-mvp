import React from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
          </GestureHandlerRootView>
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  );

  
}
// Use the admin panel
app.use(App);