import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { UserPreferences, Interest } from '../types/Resource';

interface PreferencesScreenProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onComplete }) => {
  const [opportunityTypes, setOpportunityTypes] = useState<('internship' | 'extracurricular' | 'community' | 'job')[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);

  const toggleOpportunityType = (type: 'internship' | 'extracurricular' | 'community' | 'job') => {
    setOpportunityTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleInterest = (interest: 'STEM' | 'Activism' | 'Art') => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    const preferences: UserPreferences = {
      opportunityTypes,
      interests,
    };
    onComplete(preferences);
  };

  const isContinueEnabled = opportunityTypes.length > 0; // Interests are optional - they just help prioritize

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Opportunity Explorer!</Text>
          <Text style={styles.subtitle}>Tell us about your interests to get started</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What opportunities are you looking for?</Text>
          <Text style={styles.sectionSubtitle}>(Select all that apply)</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                opportunityTypes.includes('internship') && styles.optionButtonSelected
              ]}
              onPress={() => toggleOpportunityType('internship')}
            >
              <Text style={[
                styles.optionText,
                opportunityTypes.includes('internship') && styles.optionTextSelected
              ]}>
                💼 Internships
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                opportunityTypes.includes('extracurricular') && styles.optionButtonSelected
              ]}
              onPress={() => toggleOpportunityType('extracurricular')}
            >
              <Text style={[
                styles.optionText,
                opportunityTypes.includes('extracurricular') && styles.optionTextSelected
              ]}>
                🎯 Extra-curriculars
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                opportunityTypes.includes('community') && styles.optionButtonSelected
              ]}
              onPress={() => toggleOpportunityType('community')}
            >
              <Text style={[
                styles.optionText,
                opportunityTypes.includes('community') && styles.optionTextSelected
              ]}>
                🤝 Community Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                opportunityTypes.includes('job') && styles.optionButtonSelected
              ]}
              onPress={() => toggleOpportunityType('job')}
            >
              <Text style={[
                styles.optionText,
                opportunityTypes.includes('job') && styles.optionTextSelected
              ]}>
                💰 Jobs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are your interests?</Text>
          <Text style={styles.sectionSubtitle}>(Select as many as you like - we'll prioritize opportunities that match!)</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('STEM') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('STEM')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('STEM') && styles.optionTextSelected
              ]}>
                🔬 STEM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Activism') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Activism')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Activism') && styles.optionTextSelected
              ]}>
                📢 Activism
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Art') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Art')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Art') && styles.optionTextSelected
              ]}>
                🎨 Art
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Sports') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Sports')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Sports') && styles.optionTextSelected
              ]}>
                ⚽ Sports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Music') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Music')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Music') && styles.optionTextSelected
              ]}>
                🎵 Music
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Business') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Business')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Business') && styles.optionTextSelected
              ]}>
                💼 Business
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Healthcare') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Healthcare')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Healthcare') && styles.optionTextSelected
              ]}>
                🏥 Healthcare
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Education') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Education')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Education') && styles.optionTextSelected
              ]}>
                📚 Education
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Environment') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Environment')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Environment') && styles.optionTextSelected
              ]}>
                🌱 Environment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Leadership') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Leadership')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Leadership') && styles.optionTextSelected
              ]}>
                👑 Leadership
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Technology') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Technology')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Technology') && styles.optionTextSelected
              ]}>
                💻 Technology
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Writing') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Writing')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Writing') && styles.optionTextSelected
              ]}>
                ✍️ Writing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Theater') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Theater')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Theater') && styles.optionTextSelected
              ]}>
                🎭 Theater
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                interests.includes('Community Service') && styles.optionButtonSelected
              ]}
              onPress={() => toggleInterest('Community Service')}
            >
              <Text style={[
                styles.optionText,
                interests.includes('Community Service') && styles.optionTextSelected
              ]}>
                🤝 Community Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isContinueEnabled && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isContinueEnabled}
        >
          <Text style={[
            styles.continueButtonText,
            !isContinueEnabled && styles.continueButtonTextDisabled
          ]}>
            Continue to Explore 🚀
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  optionTextSelected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#7f8c8d',
  },
});
