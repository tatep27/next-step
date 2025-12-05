import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { OpportunityCard } from '../components/OpportunityCard';
import { mockOpportunities } from '../data/mockOpportunities';
import { SavedResource, UserPreferences, Resource, Interest } from '../types/Resource';
import { OnboardingOverlay, OnboardingStep } from '../components/OnboardingOverlay';
import { hasCompletedOnboarding, markOnboardingComplete, resetOnboarding } from '../utils/onboarding';

interface SwipeScreenProps {
  preferences: UserPreferences | null;
  onNavigateToSaved: (savedOpportunities: SavedResource[]) => void;
  onNavigateToFriends: () => void;
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({ preferences, onNavigateToSaved, onNavigateToFriends }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedResource[]>([]);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [buttonPositions, setButtonPositions] = useState<{
    saved?: { x: number; y: number; width: number; height: number };
    friends?: { x: number; y: number; width: number; height: number };
    actionButtons?: { x: number; y: number; width: number; height: number };
  }>({});
  
  // Refs for highlighting elements
  const savedButtonRef = useRef<View>(null);
  const friendsButtonRef = useRef<View>(null);
  const actionButtonsRef = useRef<View>(null);

  // Maps interests to related tags for scoring
  const getInterestTags = (interest: Interest): string[] => {
    const interestLower = interest.toLowerCase();
    const tagMap: Record<string, string[]> = {
      'stem': ['stem', 'science', 'technology', 'engineering', 'math', 'programming', 'robotics', 'research', 'biotechnology', 'cybersecurity', 'ai', 'software', 'computer', 'digital', 'tech', 'coding'],
      'activism': ['activism', 'social justice', 'advocacy', 'protest', 'climate', 'environment', 'sustainability', 'civic engagement', 'policy', 'government', 'leadership', 'community organizing'],
      'art': ['art', 'creative', 'visual arts', 'photography', 'gallery', 'curatorial', 'design'],
      'sports': ['sports', 'fitness', 'athletics', 'coaching', 'teamwork', 'recreation'],
      'music': ['music', 'orchestra', 'performance', 'recording', 'audio'],
      'business': ['business', 'career', 'finance', 'consulting', 'professional', 'entrepreneurship', 'workforce development'],
      'healthcare': ['healthcare', 'hospital', 'medical', 'health', 'medicine', 'clinical'],
      'education': ['education', 'teaching', 'tutoring', 'learning', 'academic', 'school', 'curriculum'],
      'environment': ['environment', 'conservation', 'sustainability', 'climate', 'ecology', 'green'],
      'leadership': ['leadership', 'mentoring', 'management', 'organizing', 'advocacy'],
      'technology': ['technology', 'tech', 'programming', 'coding', 'software', 'digital', 'computer', 'cybersecurity'],
      'writing': ['writing', 'journalism', 'literature', 'creative writing', 'poetry', 'slam poetry'],
      'theater': ['theater', 'theatre', 'performance', 'drama', 'acting'],
      'community service': ['community', 'volunteer', 'service', 'community service', 'mentoring', 'tutoring']
    };
    return tagMap[interestLower] || [interestLower];
  };

  // Calculate alignment score for an opportunity based on interests
  const calculateAlignmentScore = (opp: Resource, userInterests: Interest[]): number => {
    if (userInterests.length === 0) {
      return 0; // No interests selected = neutral score
    }

    let score = 0;
    const oppTagsLower = opp.tags.map(tag => tag.toLowerCase());

    userInterests.forEach(interest => {
      const relatedTags = getInterestTags(interest);
      // Check if any related tag matches any opportunity tag
      const matches = relatedTags.some(relatedTag => {
        const relatedTagLower = relatedTag.toLowerCase();
        return oppTagsLower.some(tag => 
          tag.includes(relatedTagLower) || relatedTagLower.includes(tag)
        );
      });
      if (matches) {
        score += 1; // Add 1 point for each matching interest
      }
    });

    // Return score as percentage of interests matched
    return score / userInterests.length;
  };

  // Filter and sort opportunities based on user preferences
  const filteredOpportunities = useMemo(() => {
    if (!preferences || preferences.opportunityTypes.length === 0) {
      return mockOpportunities; // Show all if no preferences
    }

    // First, filter by category (opportunity type)
    const categoryFiltered = mockOpportunities.filter((opp: Resource) => {
      return preferences.opportunityTypes.includes(opp.category);
    });

    // Then, sort by alignment score (most aligned first)
    const sorted = [...categoryFiltered].sort((a, b) => {
      const scoreA = calculateAlignmentScore(a, preferences.interests || []);
      const scoreB = calculateAlignmentScore(b, preferences.interests || []);
      return scoreB - scoreA; // Higher score first
    });

    return sorted;
  }, [preferences]);

  // Reset index when filtered opportunities change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredOpportunities.length]);

  // Measure button positions
  const measureButton = (ref: React.RefObject<View>, key: 'saved' | 'friends' | 'actionButtons') => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setButtonPositions(prev => ({
          ...prev,
          [key]: { x, y, width, height }
        }));
      });
    }
  };

  // Measure all buttons when onboarding starts
  useEffect(() => {
    if (showOnboarding && onboardingStep) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        measureButton(savedButtonRef, 'saved');
        measureButton(friendsButtonRef, 'friends');
        measureButton(actionButtonsRef, 'actionButtons');
      }, 100);
    }
  }, [showOnboarding, onboardingStep]);

  // Track if we've already checked onboarding in this session
  const hasCheckedOnboarding = useRef(false);
  const previousPreferencesRef = useRef<UserPreferences | null>(null);

  // Check onboarding status only when preferences are first set (not when navigating back)
  useEffect(() => {
    const checkOnboarding = async () => {
      // Only check if preferences exist and are new (not the same as before)
      if (!preferences) return;
      
      // If preferences haven't changed, don't check again (user navigated back)
      if (previousPreferencesRef.current === preferences) {
        return;
      }
      
      // Mark that we've seen these preferences
      previousPreferencesRef.current = preferences;
      
      // Only check onboarding once per session
      if (hasCheckedOnboarding.current) return;
      hasCheckedOnboarding.current = true;
      
      try {
        const completed = await hasCompletedOnboarding();
        if (!completed) {
          // Show onboarding if not completed and preferences are set
          // Small delay to ensure layout is ready
          setTimeout(() => {
            setOnboardingStep(1);
            setShowOnboarding(true);
          }, 300);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        // If there's an error, show onboarding anyway if preferences exist
        setTimeout(() => {
          setOnboardingStep(1);
          setShowOnboarding(true);
        }, 300);
      }
    };
    
    checkOnboarding();
  }, [preferences]);

  const handleOnboardingNext = () => {
    if (onboardingStep && onboardingStep < 4) {
      setOnboardingStep((onboardingStep + 1) as OnboardingStep);
    }
  };

  const handleOnboardingComplete = async () => {
    await markOnboardingComplete();
    setShowOnboarding(false);
    setOnboardingStep(null);
  };

  const currentOpportunity = filteredOpportunities[currentIndex];

  const handleSwipeLeft = () => {
    if (currentIndex < filteredOpportunities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('No more opportunities!', 'You\'ve seen all opportunities in your selected categories. Opportunities are sorted by how well they match your interests!');
    }
  };

  const handleSwipeRight = () => {
    if (currentOpportunity) {
      const savedResource: SavedResource = {
        ...currentOpportunity,
        savedAt: new Date(),
        actionType: 'like',
      };
      setSavedOpportunities([...savedOpportunities, savedResource]);
    }
    handleSwipeLeft();
  };

  const handleSwipeUp = () => {
    if (currentOpportunity) {
      const savedResource: SavedResource = {
        ...currentOpportunity,
        savedAt: new Date(),
        actionType: 'superLike',
      };
      setSavedOpportunities([...savedOpportunities, savedResource]);
    }
    handleSwipeLeft();
  };

  const handleViewSaved = () => {
    onNavigateToSaved(savedOpportunities);
  };

  if (filteredOpportunities.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No opportunities found!</Text>
          <Text style={styles.emptySubtext}>
            We couldn't find any opportunities in the selected categories.{'\n'}
            Try selecting different opportunity types on the preferences screen.
          </Text>
          {savedOpportunities.length > 0 && (
            <TouchableOpacity style={styles.viewSavedButton} onPress={handleViewSaved}>
              <Text style={styles.viewSavedButtonText}>View Saved ({savedOpportunities.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (!currentOpportunity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more opportunities!</Text>
          <Text style={styles.emptySubtext}>
            You've seen all {filteredOpportunities.length} opportunities in your selected categories.{'\n'}
            Opportunities are sorted by how well they match your interests.{'\n'}
            Check back later for new opportunities!
          </Text>
          {savedOpportunities.length > 0 && (
            <TouchableOpacity style={styles.viewSavedButton} onPress={handleViewSaved}>
              <Text style={styles.viewSavedButtonText}>View Saved ({savedOpportunities.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View 
          ref={friendsButtonRef}
          onLayout={() => measureButton(friendsButtonRef, 'friends')}
          style={{ opacity: onboardingStep === 4 ? 0 : 1 }}
        >
          <TouchableOpacity
            style={styles.friendsButton}
            onPress={onNavigateToFriends}
            disabled={onboardingStep === 4}
          >
            <Text style={styles.friendsButtonText}>
              👥 Friends
            </Text>
          </TouchableOpacity>
        </View>
        <View 
          ref={savedButtonRef}
          onLayout={() => measureButton(savedButtonRef, 'saved')}
          style={{ opacity: onboardingStep === 3 ? 0 : 1 }}
        >
          <TouchableOpacity
            style={styles.savedButton}
            onPress={handleViewSaved}
            disabled={onboardingStep === 3}
          >
            <Text style={styles.savedButtonText}>
              💾 Saved ({savedOpportunities.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.cardContainer}>
        <OpportunityCard
          opportunity={currentOpportunity}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          actionButtonsRef={actionButtonsRef as React.RefObject<View>}
          highlightActionButtons={false}
          hideActionButtons={onboardingStep === 2}
          onActionButtonsLayout={() => measureButton(actionButtonsRef, 'actionButtons')}
        />
      </View>

      <OnboardingOverlay
        visible={!!(onboardingStep && showOnboarding)}
        currentStep={onboardingStep}
        onNext={handleOnboardingNext}
        onComplete={handleOnboardingComplete}
        buttonPositions={buttonPositions}
        savedButtonElement={
          onboardingStep === 3 ? (
            <View style={{ padding: 12, alignItems: 'flex-start' }}>
              <TouchableOpacity
                style={[
                  styles.savedButton,
                  styles.highlightedElement,
                  styles.highlightedButton,
                  styles.savedButtonHighlighted,
                  { flexShrink: 0 } // Prevent button from shrinking
                ]}
              >
                <Text style={[styles.savedButtonText, styles.highlightedButtonText]}>
                  💾 Saved ({savedOpportunities.length})
                </Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
        friendsButtonElement={
          onboardingStep === 4 ? (
            <View style={{ padding: 12, alignItems: 'flex-start' }}>
              <TouchableOpacity
                style={[
                  styles.friendsButton,
                  styles.highlightedElement,
                  styles.highlightedButton,
                  styles.friendsButtonHighlighted,
                  { flexShrink: 0 } // Prevent button from shrinking
                ]}
              >
                <Text style={[styles.friendsButtonText, styles.highlightedButtonText]}>
                  👥 Friends
                </Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
        actionButtonsElement={
          onboardingStep === 2 && currentOpportunity ? (
            <View style={[styles.actionButtonsHighlighted, styles.highlightedElement]}>
              <TouchableOpacity 
                style={[
                  styles.passButtonHighlighted,
                  { transform: [{ scale: 1.05 }] }
                ]}
              >
                <Text style={styles.buttonTextHighlighted}>
                  ❌ Pass
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.likeButtonHighlighted,
                  { transform: [{ scale: 1.05 }] }
                ]}
              >
                <Text style={styles.buttonTextHighlighted}>
                  💾 Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.learnMoreButtonHighlighted,
                  { transform: [{ scale: 1.05 }] }
                ]}
              >
                <Text style={styles.buttonTextHighlighted}>
                  🔗 Learn More
                </Text>
              </TouchableOpacity>
            </View>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    zIndex: 100,
    elevation: 100,
  },
  friendsButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 200,
    elevation: 200,
    opacity: 1,
  },
  friendsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  savedButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 200,
    elevation: 200,
    opacity: 1,
  },
  savedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewSavedButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewSavedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightedElement: {
    borderWidth: 4,
    borderColor: '#f39c12',
    shadowColor: '#f39c12',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
    opacity: 1, // Ensure full opacity
    transform: [{ scale: 1.05 }], // Slightly larger to stand out
  },
  highlightedButton: {
    opacity: 1,
  },
  // Brighter colors for highlighted buttons
  friendsButtonHighlighted: {
    backgroundColor: '#b86ed4', // Brighter purple
  },
  savedButtonHighlighted: {
    backgroundColor: '#5dade2', // Brighter blue
  },
  highlightedButtonText: {
    fontSize: 15, // Slightly larger text
    fontWeight: '700', // Bolder
  },
  // Styles for action buttons rendered on top
  actionButtonsHighlighted: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    borderRadius: 20,
  },
  passButtonHighlighted: {
    backgroundColor: '#ff6b6b', // Brighter red
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    opacity: 1,
  },
  likeButtonHighlighted: {
    backgroundColor: '#51cf66', // Brighter green
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    opacity: 1,
  },
  learnMoreButtonHighlighted: {
    backgroundColor: '#4dabf7', // Brighter blue
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    opacity: 1,
  },
  buttonTextHighlighted: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});