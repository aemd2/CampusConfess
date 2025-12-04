/**
 * Authentication Layout
 * 
 * This layout wraps all authentication screens:
 * - campus-gate.tsx (campus selection + email entry)
 * - verify-code.tsx (6-digit code verification)
 * 
 * Provides:
 * - Consistent styling/theme
 * - Loading states
 * - Error boundaries
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';

export default function AuthLayout() {
  console.log('🎬 [AuthLayout] Mounting authentication flow');
  
  return (
    <>
      <StatusBar style="light" />
      
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background.primary,
          },
          animation: 'slide_from_right',
        }}
      >
        {/* Campus Selection & Email Entry */}
        <Stack.Screen
          name="campus-gate"
          options={{
            title: 'Campus Gate',
            gestureEnabled: false, // Prevent swipe back
          }}
        />
        
        {/* 6-Digit Code Verification */}
        <Stack.Screen
          name="verify-code"
          options={{
            title: 'Verify Code',
            gestureEnabled: true, // Allow back to email entry
          }}
        />
      </Stack>
    </>
  );
}
