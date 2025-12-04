/**
 * App Entry Point
 * 
 * Handles initial route and redirects users:
 * - If authenticated -> Main app (feed)
 * - If not authenticated -> Auth flow (campus-gate)
 */

import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Box, Spinner } from 'native-base';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('[Index] Auth status:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);
  
  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Box
        flex={1}
        bg={Colors.background.primary}
        justifyContent="center"
        alignItems="center"
      >
        <Spinner color={Colors.primary.main} size="lg" />
      </Box>
    );
  }
  
  // Redirect based on auth status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/feed" />;
  }
  
  return <Redirect href="/(auth)/campus-gate" />;
}
