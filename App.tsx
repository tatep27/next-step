import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SwipeScreen } from './src/screens/SwipeScreen';
import { PreferencesScreen } from './src/screens/PreferencesScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { UserPreferences, SavedResource } from './src/types/Resource';

type Screen = 'preferences' | 'swipe' | 'saved' | 'friends';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('preferences');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedResource[]>([]);

  const handlePreferencesComplete = (userPreferences: UserPreferences) => {
    setPreferences(userPreferences);
    setCurrentScreen('swipe');
  };

  const handleNavigateToSaved = (saved: SavedResource[]) => {
    setSavedOpportunities(saved);
    setCurrentScreen('saved');
  };

  const handleBackToSwipe = () => {
    setCurrentScreen('swipe');
  };

  const handleNavigateToFriends = () => {
    setCurrentScreen('friends');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'preferences':
        return <PreferencesScreen onComplete={handlePreferencesComplete} />;
      case 'swipe':
        return (
          <SwipeScreen 
            preferences={preferences}
            onNavigateToSaved={handleNavigateToSaved}
            onNavigateToFriends={handleNavigateToFriends}
          />
        );
      case 'saved':
        return (
          <SavedScreen
            savedOpportunities={savedOpportunities}
            onBack={handleBackToSwipe}
          />
        );
      case 'friends':
        return (
          <FriendsScreen
            onBack={handleBackToSwipe}
          />
        );
      default:
        return <PreferencesScreen onComplete={handlePreferencesComplete} />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="auto" />
    </>
  );
}