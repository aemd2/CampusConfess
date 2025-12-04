/**
 * Campus Gate Screen
 * 
 * First screen in authentication flow.
 * 
 * USER FLOW:
 * 1. User selects their campus from dropdown
 * 2. User enters their .edu email
 * 3. User taps "Continue" → sends 6-digit verification code
 * 4. Navigates to verify-code screen
 * 
 * DESIGN:
 * - Dark theme background (#0F172A)
 * - Clean, minimal UI
 * - Clear error messages
 * - Loading states
 */

import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Select,
  CheckIcon,
  FormControl,
  WarningOutlineIcon,
  Spinner,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography, TextStyles } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { getActiveCampuses, sendVerificationCode } from '@/lib/auth';
import type { Campus } from '@/types/database.types';

export default function CampusGateScreen() {
  console.log('🎬 [CampusGate] Screen mounting');
  
  // ===========================
  // State
  // ===========================
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCampuses, setLoadingCampuses] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // ===========================
  // Load Campuses on Mount
  // ===========================
  useEffect(() => {
    console.log('🔄 [CampusGate] Loading campuses...');
    
    async function loadCampuses() {
      try {
        const data = await getActiveCampuses();
        console.log('✅ [CampusGate] Loaded', data.length, 'campuses');
        setCampuses(data);
      } catch (err: any) {
        console.error('❌ [CampusGate] Error loading campuses:', err);
        setError('Failed to load campuses. Please check your internet connection.');
      } finally {
        setLoadingCampuses(false);
      }
    }
    
    loadCampuses();
  }, []);
  
  // ===========================
  // Handle Continue Button
  // ===========================
  const handleContinue = async () => {
    console.log('👆 [CampusGate] User tapped Continue');
    console.log('📧 [CampusGate] Email:', email);
    console.log('🏛️ [CampusGate] Campus ID:', selectedCampusId);
    
    // Clear previous errors
    setError('');
    
    // Validation
    if (!selectedCampusId) {
      console.warn('⚠️ [CampusGate] No campus selected');
      setError('Please select your campus');
      return;
    }
    
    if (!email.trim()) {
      console.warn('⚠️ [CampusGate] No email entered');
      setError('Please enter your .edu email');
      return;
    }
    
    if (!email.toLowerCase().endsWith('.edu')) {
      console.warn('⚠️ [CampusGate] Email is not .edu');
      setError('Please use your campus .edu email address');
      return;
    }
    
    // Get campus domain to verify email matches
    const campus = campuses.find((c) => c.id === selectedCampusId);
    if (!campus) {
      setError('Selected campus not found');
      return;
    }
    
    const emailDomain = email.toLowerCase().split('@')[1];
    if (emailDomain !== campus.domain) {
      console.warn('⚠️ [CampusGate] Email domain mismatch');
      setError(`Email must be from ${campus.domain}`);
      return;
    }
    
    console.log('✅ [CampusGate] Validation passed');
    
    // Send verification code
    setLoading(true);
    
    try {
      console.log('📤 [CampusGate] Sending verification code...');
      
      const result = await sendVerificationCode({
        email: email.toLowerCase().trim(),
        campus_id: selectedCampusId,
      });
      
      if (!result.success) {
        console.error('❌ [CampusGate] Failed to send code:', result.error);
        setError(result.error || 'Failed to send verification code');
        setLoading(false);
        return;
      }
      
      console.log('✅ [CampusGate] Verification code sent');
      
      // Navigate to verify code screen
      router.push({
        pathname: '/(auth)/verify-code',
        params: {
          email: email.toLowerCase().trim(),
          campusId: selectedCampusId,
        },
      });
      
    } catch (err: any) {
      console.error('🚨 [CampusGate] Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // ===========================
  // Render Loading State
  // ===========================
  if (loadingCampuses) {
    return (
      <Box
        flex={1}
        bg={Colors.background.primary}
        justifyContent="center"
        alignItems="center"
      >
        <Spinner color={Colors.primary.main} size="lg" />
        <Text
          mt={Spacing.md}
          color={Colors.text.secondary}
          {...TextStyles.body}
        >
          Loading campuses...
        </Text>
      </Box>
    );
  }
  
  // ===========================
  // Render Main Screen
  // ===========================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
    >
      <ScrollView
        flex={1}
        bg={Colors.background.primary}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: Spacing.screen.horizontal,
          paddingVertical: Spacing.screen.vertical,
        }}
      >
        <VStack space={Spacing.xl} flex={1} justifyContent="center">
          {/* Header */}
          <VStack space={Spacing.sm} alignItems="center">
            <Text {...TextStyles.h1} color={Colors.text.primary}>
              🎓 CampusConfess
            </Text>
            <Text
              {...TextStyles.body}
              color={Colors.text.secondary}
              textAlign="center"
            >
              Anonymous confessions for your campus
            </Text>
          </VStack>
          
          {/* Form */}
          <VStack space={Spacing.lg}>
            {/* Campus Selection */}
            <FormControl isRequired isInvalid={!!error && !selectedCampusId}>
              <FormControl.Label
                _text={{
                  color: Colors.text.primary,
                  ...TextStyles.label,
                }}
              >
                Select Your Campus
              </FormControl.Label>
              
              <Select
                selectedValue={selectedCampusId}
                minWidth="100%"
                accessibilityLabel="Choose campus"
                placeholder="Choose your campus"
                _selectedItem={{
                  bg: Colors.primary.main,
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(value) => {
                  console.log('📍 [CampusGate] Campus selected:', value);
                  setSelectedCampusId(value);
                  setError('');
                }}
                bg={Colors.card.background}
                borderColor={Colors.border.default}
                color={Colors.text.primary}
                _actionSheetContent={{
                  bg: Colors.background.secondary,
                }}
              >
                {campuses.map((campus) => (
                  <Select.Item
                    key={campus.id}
                    label={campus.name}
                    value={campus.id}
                  />
                ))}
              </Select>
              
              <FormControl.HelperText
                _text={{
                  color: Colors.text.tertiary,
                  ...TextStyles.caption,
                }}
              >
                Your campus must be verified
              </FormControl.HelperText>
            </FormControl>
            
            {/* Email Input */}
            <FormControl isRequired isInvalid={!!error && !!email}>
              <FormControl.Label
                _text={{
                  color: Colors.text.primary,
                  ...TextStyles.label,
                }}
              >
                Campus Email (.edu)
              </FormControl.Label>
              
              <Input
                placeholder="your.name@campus.edu"
                value={email}
                onChangeText={(text) => {
                  console.log('📝 [CampusGate] Email changed');
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                bg={Colors.card.background}
                borderColor={Colors.border.default}
                color={Colors.text.primary}
                placeholderTextColor={Colors.text.tertiary}
                _focus={{
                  borderColor: Colors.primary.main,
                  bg: Colors.card.background,
                }}
                fontSize={Typography.sizes.base}
              />
              
              <FormControl.HelperText
                _text={{
                  color: Colors.text.tertiary,
                  ...TextStyles.caption,
                }}
              >
                We'll send a verification code to this email
              </FormControl.HelperText>
            </FormControl>
            
            {/* Error Message */}
            {error && (
              <Box
                bg={Colors.error.background}
                p={Spacing.md}
                borderRadius={Spacing.radius.md}
                borderWidth={1}
                borderColor={Colors.error.main}
              >
                <Text color={Colors.error.main} {...TextStyles.bodySmall}>
                  <WarningOutlineIcon color={Colors.error.main} mr={2} />
                  {error}
                </Text>
              </Box>
            )}
            
            {/* Continue Button */}
            <Button
              onPress={handleContinue}
              isLoading={loading}
              isLoadingText="Sending code..."
              isDisabled={loading}
              bg={Colors.primary.main}
              _pressed={{ bg: Colors.primary.dark }}
              _hover={{ bg: Colors.primary.light }}
              _text={{
                color: Colors.primary.contrast,
                ...TextStyles.button,
              }}
              py={Spacing.button.paddingY}
              borderRadius={Spacing.button.borderRadius}
            >
              Continue
            </Button>
          </VStack>
          
          {/* Footer */}
          <VStack space={Spacing.sm} alignItems="center" mt="auto">
            <Text {...TextStyles.caption} color={Colors.text.tertiary} textAlign="center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
            <Text {...TextStyles.caption} color={Colors.text.tertiary}>
              🔒 Your identity is always anonymous
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
