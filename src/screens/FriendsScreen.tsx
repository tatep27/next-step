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

interface Friend {
  id: string;
  name: string;
  avatar: string;
  recentActivity: {
    opportunityTitle: string;
    opportunityImage: string;
    actionType: 'save' | 'save+pursue';
    timestamp: string;
    externalLink: string;
  }[];
}

const sampleFriends: Friend[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    recentActivity: [
      {
        opportunityTitle: 'Summer STEM Internship at TechCorp',
        opportunityImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop',
        actionType: 'save+pursue',
        timestamp: '2 hours ago',
        externalLink: 'https://techcorp.com/internships',
      },
      {
        opportunityTitle: 'Climate Action Youth Summit',
        opportunityImage: 'https://images.unsplash.com/photo-1542601906990-b4d3b77857f6?w=200&h=120&fit=crop',
        actionType: 'save',
        timestamp: '1 day ago',
        externalLink: 'https://climateyouth.org/summit',
      },
    ],
  },
  {
    id: '2',
    name: 'Maya Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    recentActivity: [
      {
        opportunityTitle: 'Digital Art Workshop Series',
        opportunityImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=120&fit=crop',
        actionType: 'save+pursue',
        timestamp: '4 hours ago',
        externalLink: 'https://artstudio.com/workshops',
      },
      {
        opportunityTitle: 'Community Garden Volunteer Program',
        opportunityImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=120&fit=crop',
        actionType: 'save',
        timestamp: '2 days ago',
        externalLink: 'https://communitygarden.org/volunteer',
      },
    ],
  },
  {
    id: '3',
    name: 'Jordan Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    recentActivity: [
      {
        opportunityTitle: 'Robotics Competition Team',
        opportunityImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=120&fit=crop',
        actionType: 'save+pursue',
        timestamp: '6 hours ago',
        externalLink: 'https://roboticsclub.org/join',
      },
      {
        opportunityTitle: 'Coding Bootcamp Scholarship Program',
        opportunityImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=200&h=120&fit=crop',
        actionType: 'save',
        timestamp: '3 days ago',
        externalLink: 'https://codingbootcamp.edu/scholarships',
      },
    ],
  },
  {
    id: '4',
    name: 'Sam Taylor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    recentActivity: [
      {
        opportunityTitle: 'Social Justice Art Exhibition',
        opportunityImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=120&fit=crop',
        actionType: 'save+pursue',
        timestamp: '1 day ago',
        externalLink: 'https://socialart.org/exhibition',
      },
      {
        opportunityTitle: 'Environmental Research Internship',
        opportunityImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=120&fit=crop',
        actionType: 'save',
        timestamp: '4 days ago',
        externalLink: 'https://envresearch.org/internships',
      },
    ],
  },
];

interface FriendsScreenProps {
  onBack: () => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({ onBack }) => {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const getActionIcon = (actionType: 'save' | 'save+pursue') => {
    return actionType === 'save+pursue' ? '🚀' : '💾';
  };

  const getActionText = (actionType: 'save' | 'save+pursue') => {
    return actionType === 'save+pursue' ? 'Save + Pursue' : 'Save';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends Activity</Text>
        <Text style={styles.headerSubtitle}>See what your friends are exploring</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {sampleFriends.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.friendHeader}>
              <Image source={{ uri: friend.avatar }} style={styles.avatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.activityCount}>
                  {friend.recentActivity.length} recent activities
                </Text>
              </View>
            </View>
            
            <View style={styles.activityContainer}>
              {friend.recentActivity.map((activity, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.activityItem}
                  onPress={() => handleOpenLink(activity.externalLink)}
                >
                  <Image source={{ uri: activity.opportunityImage }} style={styles.activityImage} />
                  
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle} numberOfLines={2}>
                        {activity.opportunityTitle}
                      </Text>
                      <View style={[
                        styles.actionBadge,
                        activity.actionType === 'save+pursue' ? styles.savePursueBadge : styles.saveBadge
                      ]}>
                        <Text style={styles.badgeText}>
                          {getActionIcon(activity.actionType)} {getActionText(activity.actionType)}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  friendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  activityImage: {
    width: 60,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  actionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saveBadge: {
    backgroundColor: '#27ae60',
  },
  savePursueBadge: {
    backgroundColor: '#f39c12',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  activityTimestamp: {
    fontSize: 11,
    color: '#95a5a6',
  },
});
