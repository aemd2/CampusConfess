/**
 * Root App Layout
 * 
 * This is the root layout for the entire app.
 * Wraps all screens with:
 * - NativeBaseProvider (UI theme)
 * - AuthProvider (authentication state)
 * - Theme configuration
 */

import { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// NativeBase Theme Config
const theme = {
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark' as const,
  },
  colors: {
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.background,
    text: Colors.text,
    card: Colors.card,
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    info: Colors.info,
  },
} as any;

function RootLayout() {
  console.log('[RootLayout] App initializing');
  
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="light" />
        <RootLayoutNav />
      </AuthProvider>
    </NativeBaseProvider>
  );
}

function RootLayoutNav() {
  const { isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);
  
  if (isLoading) {
    return null;
  }
  
  return <Slot />;
}

export default RootLayout;
