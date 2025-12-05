import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type OnboardingStep = 1 | 2 | 3 | 4 | null;

interface ButtonPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OnboardingOverlayProps {
  visible: boolean;
  currentStep: OnboardingStep | null;
  onNext: () => void;
  onComplete: () => void;
  buttonPositions?: {
    saved?: ButtonPosition;
    friends?: ButtonPosition;
    actionButtons?: ButtonPosition;
  };
  // Button elements to render on top
  savedButtonElement?: React.ReactNode;
  friendsButtonElement?: React.ReactNode;
  actionButtonsElement?: React.ReactNode;
  children?: React.ReactNode;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  visible,
  currentStep,
  onNext,
  onComplete,
  buttonPositions,
  savedButtonElement,
  friendsButtonElement,
  actionButtonsElement,
  children,
}) => {
  const handleButtonPress = () => {
    if (!currentStep) return;
    if (currentStep === 4) {
      onComplete();
    } else {
      onNext();
    }
  };

  const getButtonText = () => {
    if (!currentStep) return 'Next';
    switch (currentStep) {
      case 1:
        return 'Show me around';
      case 4:
        return 'Got it!';
      default:
        return 'Next';
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return { title: '', description: '' };
    switch (currentStep) {
      case 1:
        return {
          title: 'Welcome to NextStep!',
          description:
            "NextStep helps you find opportunities that align with your interests and goals by 'swiping' through them. The app is designed to consistently update when new opportunities appear.",
        };
      case 2:
        return {
          title: 'Action Buttons',
          description:
            'Use these buttons to interact with opportunities: Pass to skip, Save to keep for later, and Learn More to open the full details. This is how you navigate through opportunities.',
        };
      case 3:
        return {
          title: 'Saved Opportunities',
          description:
            'Tap the Saved button to view all opportunities you\'ve saved. You can access them anytime to review or pursue them further.',
        };
      case 4:
        return {
          title: 'Friends Activity',
          description:
            'See what opportunities your friends are exploring and saving. Discover new opportunities through your network!',
        };
      default:
        return { title: '', description: '' };
    }
  };

  const content = renderStepContent();
  const showStepCounter = currentStep > 1 && currentStep < 5;

  // Get modal positioning style based on step and button positions
  const getModalPositionStyle = () => {
    const MODAL_MARGIN = 30; // Minimum margin from buttons
    
    switch (currentStep) {
      case 1:
        return styles.modalCenter; // Centered for welcome
      case 2:
        // Position above action buttons with margin
        if (buttonPositions?.actionButtons) {
          // Calculate bottom position: screen height - button top position + margin
          const bottomPosition = SCREEN_HEIGHT - buttonPositions.actionButtons.y + MODAL_MARGIN;
          return {
            ...styles.modalBottomCenter,
            bottom: bottomPosition,
          };
        }
        return styles.modalBottomCenter;
      case 3:
        // Position below Saved button (top right area)
        if (buttonPositions?.saved) {
          // Position below the button with margin
          const topPosition = buttonPositions.saved.y + buttonPositions.saved.height + MODAL_MARGIN;
          return {
            ...styles.modalTopRight,
            top: topPosition,
            right: 20,
          };
        }
        return styles.modalTopRight;
      case 4:
        // Position below Friends button (top left area)
        if (buttonPositions?.friends) {
          // Position below the button with margin
          const topPosition = buttonPositions.friends.y + buttonPositions.friends.height + MODAL_MARGIN;
          return {
            ...styles.modalTopLeft,
            top: topPosition,
            left: 20,
          };
        }
        return styles.modalTopLeft;
      default:
        return styles.modalCenter;
    }
  };

  if (!currentStep || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}} // Prevent closing on Android back button during onboarding
    >
      <View style={styles.container}>
        {/* Simple full-screen blur overlay - no cutouts */}
        <View style={styles.blurOverlay} />

        {/* Render highlighted buttons on top of blur */}
        {currentStep === 2 && buttonPositions?.actionButtons && actionButtonsElement && (
          <View
            style={[
              styles.highlightedButtonContainer,
              {
                left: buttonPositions.actionButtons.x,
                top: buttonPositions.actionButtons.y,
                width: buttonPositions.actionButtons.width,
                height: buttonPositions.actionButtons.height,
              },
            ]}
            pointerEvents="none"
          >
            {actionButtonsElement}
          </View>
        )}

        {currentStep === 3 && buttonPositions?.saved && savedButtonElement && (
          <View
            style={[
              styles.highlightedButtonContainer,
              {
                left: buttonPositions.saved.x - 16, // Account for border/shadow
                top: buttonPositions.saved.y - 16,
                width: Math.max(buttonPositions.saved.width + 32, 200), // Ensure minimum width for text
                height: buttonPositions.saved.height + 32,
              },
            ]}
            pointerEvents="none"
          >
            {savedButtonElement}
          </View>
        )}

        {currentStep === 4 && buttonPositions?.friends && friendsButtonElement && (
          <View
            style={[
              styles.highlightedButtonContainer,
              {
                left: buttonPositions.friends.x - 16, // Account for border/shadow
                top: buttonPositions.friends.y - 16,
                width: Math.max(buttonPositions.friends.width + 32, 150), // Ensure minimum width for "Friends" text
                height: buttonPositions.friends.height + 32,
              },
            ]}
            pointerEvents="none"
          >
            {friendsButtonElement}
          </View>
        )}

        {/* Content area - screen content renders here behind blur */}
        <View style={styles.contentContainer} pointerEvents="box-none">
          {/* Screen content is rendered as children from parent component */}
          {children}

          {/* Modal popup */}
          <View style={[styles.modal, getModalPositionStyle()]} pointerEvents="auto">
            {showStepCounter && (
              <View style={styles.stepCounter}>
                <Text style={styles.stepCounterText}>
                  {currentStep - 1}/3
                </Text>
              </View>
            )}

            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.description}>{content.description}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleButtonPress}
            >
              <Text style={styles.buttonText}>{getButtonText()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 999,
    elevation: 999,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 100,
    position: 'absolute',
    zIndex: 1000,
  },
  modalCenter: {
    top: SCREEN_HEIGHT * 0.3,
    left: 20,
    right: 20,
  },
  modalBottomCenter: {
    bottom: 120, // Default position above action buttons (will be overridden dynamically)
    left: 20,
    right: 20,
    alignSelf: 'stretch',
  },
  modalTopRight: {
    top: 100, // Below header
    right: 20,
    width: SCREEN_WIDTH * 0.75,
    maxWidth: 300,
  },
  modalTopLeft: {
    top: 100, // Below header
    left: 20,
    width: SCREEN_WIDTH * 0.75,
    maxWidth: 300,
  },
  stepCounter: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  stepCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  highlightedButtonContainer: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 1000,
    overflow: 'visible', // Allow content to extend beyond container
    alignItems: 'flex-start', // Align content to top-left
    justifyContent: 'flex-start',
  },
});

