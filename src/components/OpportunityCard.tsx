import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { Resource } from '../types/Resource';

interface OpportunityCardProps {
  opportunity: Resource;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const handleLearnMore = () => {
    Linking.openURL(opportunity.externalLink);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: opportunity.image }} style={styles.image} />
      
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{opportunity.title}</Text>
          <Text style={styles.description}>{opportunity.description}</Text>
          
          <View style={styles.details}>
            <Text style={styles.detailText}>📅 {opportunity.date}</Text>
            <Text style={styles.detailText}>🕒 {opportunity.time}</Text>
            <Text style={styles.detailText}>📍 {opportunity.location}</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {opportunity.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={onSwipeLeft}>
          <Text style={styles.buttonText}>❌ Pass</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={onSwipeRight}>
          <Text style={styles.buttonText}>💾 Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
          <Text style={styles.buttonText}>🔗 Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 22,
  },
  details: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  passButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  learnMoreButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});