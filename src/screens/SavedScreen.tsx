import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SavedResource } from '../types/Resource';

interface SavedScreenProps {
  savedOpportunities: SavedResource[];
  onBack: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ savedOpportunities, onBack }) => {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  if (savedOpportunities.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Opportunities</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved opportunities yet!</Text>
          <Text style={styles.emptySubtext}>
            Start exploring opportunities and tap 💾 Save or 🚀 Save + Pursue to save them here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Opportunities</Text>
        <Text style={styles.headerSubtitle}>{savedOpportunities.length} saved</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {savedOpportunities.map((opportunity, index) => (
          <TouchableOpacity
            key={opportunity.id}
            style={styles.opportunityCard}
            onPress={() => handleOpenLink(opportunity.externalLink)}
          >
            <Image source={{ uri: opportunity.image }} style={styles.cardImage} />
            
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {opportunity.title}
                </Text>
                <View style={[
                  styles.actionBadge,
                  opportunity.actionType === 'superLike' ? styles.superLikeBadge : styles.likeBadge
                ]}>
                  <Text style={styles.badgeText}>
                    {opportunity.actionType === 'superLike' ? '🚀 Save + Pursue' : '💾 Save'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.cardDescription} numberOfLines={2}>
                {opportunity.description}
              </Text>
              
              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>📅 {opportunity.date}</Text>
                <Text style={styles.detailText}>📍 {opportunity.location}</Text>
              </View>
              
              <View style={styles.tagsContainer}>
                {opportunity.tags.slice(0, 3).map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {opportunity.tags.length > 3 && (
                  <Text style={styles.moreTagsText}>+{opportunity.tags.length - 3} more</Text>
                )}
              </View>
              
              <Text style={styles.savedDate}>
                Saved {opportunity.savedAt.toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  opportunityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeBadge: {
    backgroundColor: '#27ae60',
  },
  superLikeBadge: {
    backgroundColor: '#f39c12',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#7f8c8d',
    alignSelf: 'center',
    marginLeft: 4,
  },
  savedDate: {
    fontSize: 11,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});
