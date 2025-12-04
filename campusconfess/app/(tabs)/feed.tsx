/**
 * Feed Screen (Placeholder)
 * 
 * Main feed showing anonymous confessions.
 * This is a placeholder - will be fully built next.
 */

import { Box, VStack, Text, Button } from 'native-base';
import { Colors } from '@/constants/Colors';
import { Typography, TextStyles } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/hooks/useAuth';

export default function FeedScreen() {
  console.log('🎬 [Feed] Screen mounting');
  
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    console.log('👆 [Feed] User tapped Sign Out');
    try {
      await signOut();
    } catch (error) {
      console.error('❌ [Feed] Error signing out:', error);
    }
  };
  
  return (
    <Box flex={1} bg={Colors.background.primary} safeArea>
      <VStack
        space={Spacing.lg}
        flex={1}
        justifyContent="center"
        alignItems="center"
        px={Spacing.screen.horizontal}
      >
        <Text {...TextStyles.h1} color={Colors.text.primary}>
          🎉 Welcome to CampusConfess!
        </Text>
        
        <Text {...TextStyles.body} color={Colors.text.secondary} textAlign="center">
          You're successfully authenticated!
        </Text>
        
        <Box
          bg={Colors.card.background}
          p={Spacing.md}
          borderRadius={Spacing.radius.md}
          width="100%"
        >
          <Text {...TextStyles.bodySmall} color={Colors.text.tertiary}>
            👤 User ID: {user?.user_id.substring(0, 8)}...
          </Text>
          <Text {...TextStyles.bodySmall} color={Colors.text.tertiary} mt={2}>
            🏛️ Campus ID: {user?.campus_id.substring(0, 8)}...
          </Text>
          <Text {...TextStyles.bodySmall} color={Colors.text.tertiary} mt={2}>
            📧 Email: {user?.email}
          </Text>
          <Text {...TextStyles.bodySmall} color={Colors.text.tertiary} mt={2}>
            👮 Moderator: {user?.is_moderator ? 'Yes' : 'No'}
          </Text>
        </Box>
        
        <Text {...TextStyles.body} color={Colors.text.primary} textAlign="center">
          The feed will be built next! 🚀
        </Text>
        
        <Button
          onPress={handleSignOut}
          variant="outline"
          borderColor={Colors.error.main}
          _text={{
            color: Colors.error.main,
            ...TextStyles.button,
          }}
        >
          Sign Out
        </Button>
      </VStack>
    </Box>
  );
}
