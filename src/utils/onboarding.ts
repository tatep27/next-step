import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@NextStep:onboarding_complete';

/**
 * Check if the user has completed onboarding
 * @returns Promise<boolean> - true if onboarding is complete, false otherwise
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Mark onboarding as complete
 * @returns Promise<void>
 */
export const markOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

/**
 * Reset onboarding status (useful for testing)
 * @returns Promise<void>
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
};

