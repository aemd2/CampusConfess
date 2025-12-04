/**
 * Profile Screen (Placeholder)
 * 
 * User settings and preferences.
 * This is a placeholder - will be fully built next.
 */

import { Box, VStack, Text } from 'native-base';
import { Colors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';
import { Spacing } from '@/constants/Spacing';

export default function ProfileScreen() {
  return (
    <Box flex={1} bg={Colors.background.primary} safeArea>
      <VStack
        space={Spacing.lg}
        flex={1}
        justifyContent="center"
        alignItems="center"
        px={Spacing.screen.horizontal}
      >
        <Text {...TextStyles.h2} color={Colors.text.primary}>
          ⚙️ Settings
        </Text>
        <Text {...TextStyles.body} color={Colors.text.secondary}>
          Coming soon!
        </Text>
      </VStack>
    </Box>
  );
}
