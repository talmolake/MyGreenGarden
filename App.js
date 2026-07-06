import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { seedDefaultPlants } from './src/utils/seedData';
import NicknameModal from './src/components/NicknameModal';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Merriweather_400Regular } from '@expo-google-fonts/merriweather';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import {
  PlayfairDisplay_400Regular,
} from '@expo-google-fonts/playfair-display';
import {
  SourceSerifPro_400Regular,
} from '@expo-google-fonts/source-serif-pro';

const App = () => {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter Bold': Inter_700Bold,
    Lato: Lato_400Regular,
    'Lato Bold': Lato_700Bold,
    Merriweather: Merriweather_400Regular,
    Oswald: Oswald_400Regular,
    Nunito: Nunito_400Regular,
    Poppins: Poppins_400Regular,
    'Playfair Display': PlayfairDisplay_400Regular,
    'Source Serif Pro': SourceSerifPro_400Regular,
  });

  useEffect(() => {
    seedDefaultPlants().catch(err =>
      console.warn('[Seed] Failed to seed plants:', err),
    );
  }, []);

  if (!fontsLoaded) return null;

  return (
      <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
            <NicknameModal />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;