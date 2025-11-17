export interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
  externalLink: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  category: 'internship' | 'extracurricular' | 'community' | 'job';
}

export type Interest = 'STEM' | 'Activism' | 'Art' | 'Sports' | 'Music' | 'Business' | 'Healthcare' | 'Education' | 'Environment' | 'Leadership' | 'Technology' | 'Writing' | 'Theater' | 'Community Service';

export interface UserPreferences {
  opportunityTypes: ('internship' | 'extracurricular' | 'community' | 'job')[];
  interests: Interest[];
}

export interface SwipeAction {
  type: 'like' | 'pass' | 'superLike';
  resourceId: string;
  timestamp: Date;
}

export interface SavedResource extends Resource {
  savedAt: Date;
  actionType: 'like' | 'superLike';
}
