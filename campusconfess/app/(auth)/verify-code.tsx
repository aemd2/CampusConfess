/**
 * Verify Code Screen
 * 
 * Second screen in authentication flow.
 * 
 * USER FLOW:
 * 1. User receives 6-digit code via email
 * 2. User enters code here
 * 3. Code is verified → account created
 * 4. User is authenticated → navigates to main app
 * 
 * FEATURES:
 * - Auto-focus on input
 * - Real-time validation
 * - Resend code option
 * - Clear error messages
 */

import { useState, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Pressable,
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
import { verifyCodeAndCreateAccount, sendVerificationCode } from '@/lib/auth';

export default function VerifyCodeScreen() {
  console.log('🎬 [VerifyCode] Screen mounting');
  
  // ===========================
  // Get Email from Navigation
  // ===========================
  const params = useLocalSearchParams<{ email: string; campusId: string }>();
  const email = params.email || '';
  const campusId = params.campusId || '';
  
  console.log('📧 [VerifyCode] Email:', email);
  console.log('🏛️ [VerifyCode] Campus ID:', campusId);
  
  // ===========================
  // State
  // ===========================
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  
  const inputRef = useRef<any>(null);
  
  // ===========================
  // Auto-Focus Input on Mount
  // ===========================
  useEffect(() => {
    console.log('🔄 [VerifyCode] Auto-focusing input');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);
  
  // ===========================
  // Resend Countdown Timer
  // ===========================
  useEffect(() => {
    console.log('🔄 [VerifyCode] Starting resend countdown');
    
    let countdown = 60;
    setResendCountdown(countdown);
    setCanResend(false);
    
    const interval = setInterval(() => {
      countdown -= 1;
      setResendCountdown(countdown);
      
      if (countdown <= 0) {
        console.log('✅ [VerifyCode] Resend available');
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [resending]);
  
  // ===========================
  // Handle Code Input Change
  // ===========================
  const handleCodeChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/[^0-9]/g, '');
    
    // Limit to 6 digits
    const limited = numbersOnly.slice(0, 6);
    
    console.log('📝 [VerifyCode] Code changed:', limited);
    setCode(limited);
    setError('');
    
    // Auto-submit when 6 digits entered
    if (limited.length === 6) {
      console.log('✅ [VerifyCode] 6 digits entered, auto-submitting');
      handleVerify(limited);
    }
  };
  
  // ===========================
  // Handle Verify Button
  // ===========================
  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code;
    
    console.log('👆 [VerifyCode] User tapped Verify');
    console.log('🔑 [VerifyCode] Code:', verificationCode);
    
    // Clear previous errors
    setError('');
    
    // Validation
    if (verificationCode.length !== 6) {
      console.warn('⚠️ [VerifyCode] Code is not 6 digits');
      setError('Please enter the 6-digit code');
      return;
    }
    
    if (!email) {
      console.error('❌ [VerifyCode] No email found');
      setError('Email missing. Please start over.');
      return;
    }
    
    console.log('✅ [VerifyCode] Validation passed');
    
    // Verify code and create account
    setLoading(true);
    
    try {
      console.log('📤 [VerifyCode] Verifying code...');
      
      const result = await verifyCodeAndCreateAccount({
        email: email,
        code: verificationCode,
      });
      
      if (!result.success) {
        console.error('❌ [VerifyCode] Verification failed:', result.error);
        setError(result.error || 'Invalid verification code');
        setLoading(false);
        setCode(''); // Clear code for retry
        return;
      }
      
      console.log('✅ [VerifyCode] Verification successful');
      console.log('🎉 [VerifyCode] Account created, navigating to main app');
      
      // Navigate to main app
      router.replace('/(tabs)/feed');
      
    } catch (err: any) {
      console.error('🚨 [VerifyCode] Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
      setCode('');
    } finally {
      setLoading(false);
    }
  };
  
  // ===========================
  // Handle Resend Code
  // ===========================
  const handleResendCode = async () => {
    console.log('👆 [VerifyCode] User tapped Resend');
    
    if (!canResend) {
      console.warn('⚠️ [VerifyCode] Resend not available yet');
      return;
    }
    
    setResending(true);
    setError('');
    
    try {
      console.log('📤 [VerifyCode] Resending verification code...');
      
      const result = await sendVerificationCode({
        email: email,
        campus_id: campusId,
      });
      
      if (!result.success) {
        console.error('❌ [VerifyCode] Failed to resend:', result.error);
        setError(result.error || 'Failed to resend code');
        setResending(false);
        return;
      }
      
      console.log('✅ [VerifyCode] Code resent successfully');
      
      // Reset countdown
      setCanResend(false);
      setResendCountdown(60);
      
    } catch (err: any) {
      console.error('🚨 [VerifyCode] Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setResending(false);
    }
  };
  
  // ===========================
  // Handle Back Button
  // ===========================
  const handleBack = () => {
    console.log('👆 [VerifyCode] User tapped Back');
    router.back();
  };
  
  // ===========================
  // Render
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
            <Text {...TextStyles.h2} color={Colors.text.primary}>
              📬 Check Your Email
            </Text>
            <Text
              {...TextStyles.body}
              color={Colors.text.secondary}
              textAlign="center"
            >
              We sent a 6-digit code to
            </Text>
            <Text
              {...TextStyles.body}
              color={Colors.primary.main}
              fontWeight={Typography.weights.semibold}
            >
              {email}
            </Text>
          </VStack>
          
          {/* Code Input */}
          <VStack space={Spacing.lg}>
            <FormControl isRequired isInvalid={!!error}>
              <FormControl.Label
                _text={{
                  color: Colors.text.primary,
                  ...TextStyles.label,
                  textAlign: 'center',
                }}
              >
                Enter Verification Code
              </FormControl.Label>
              
              <Input
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                fontSize={32}
                letterSpacing={8}
                fontWeight={Typography.weights.bold}
                bg={Colors.card.background}
                borderColor={error ? Colors.error.main : Colors.border.default}
                borderWidth={2}
                color={Colors.text.primary}
                placeholderTextColor={Colors.text.tertiary}
                _focus={{
                  borderColor: Colors.primary.main,
                  bg: Colors.card.background,
                }}
                py={Spacing.lg}
              />
              
              <FormControl.HelperText
                _text={{
                  color: Colors.text.tertiary,
                  ...TextStyles.caption,
                  textAlign: 'center',
                }}
              >
                Code expires in 15 minutes
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
                <Text color={Colors.error.main} {...TextStyles.bodySmall} textAlign="center">
                  <WarningOutlineIcon color={Colors.error.main} mr={2} />
                  {error}
                </Text>
              </Box>
            )}
            
            {/* Verify Button */}
            <Button
              onPress={() => handleVerify()}
              isLoading={loading}
              isLoadingText="Verifying..."
              isDisabled={loading || code.length !== 6}
              bg={Colors.primary.main}
              _pressed={{ bg: Colors.primary.dark }}
              _hover={{ bg: Colors.primary.light }}
              _disabled={{
                bg: Colors.text.disabled,
                opacity: 0.5,
              }}
              _text={{
                color: Colors.primary.contrast,
                ...TextStyles.button,
              }}
              py={Spacing.button.paddingY}
              borderRadius={Spacing.button.borderRadius}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            
            {/* Resend Code */}
            <VStack space={Spacing.sm} alignItems="center">
              <Text {...TextStyles.bodySmall} color={Colors.text.secondary}>
                Didn't receive the code?
              </Text>
              
              {canResend ? (
                <Pressable onPress={handleResendCode} isDisabled={resending}>
                  {resending ? (
                    <Spinner color={Colors.primary.main} size="sm" />
                  ) : (
                    <Text
                      {...TextStyles.body}
                      color={Colors.primary.main}
                      fontWeight={Typography.weights.semibold}
                    >
                      Resend Code
                    </Text>
                  )}
                </Pressable>
              ) : (
                <Text {...TextStyles.bodySmall} color={Colors.text.tertiary}>
                  Resend available in {resendCountdown}s
                </Text>
              )}
            </VStack>
          </VStack>
          
          {/* Back Button */}
          <Pressable onPress={handleBack} alignSelf="center" mt="auto">
            <Text
              {...TextStyles.body}
              color={Colors.text.secondary}
              textDecorationLine="underline"
            >
              ← Back to email entry
            </Text>
          </Pressable>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
