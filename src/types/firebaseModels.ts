import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  role?: 'student' | 'admin' | 'university_rep';
  regNo?: string;
  department?: string;
  year?: string;
  onboardingCompleted?: boolean;
  settings?: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface College {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  description: string;
  programsOffered: string[];
  imageUrl?: string;
  established: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp;
  readBy: string[];
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Application {
  id: string;
  userId: string;
  collegeId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt?: FirebaseFirestoreTypes.Timestamp;
  documents: {
    title: string;
    url: string;
  }[];
}

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  COLLEGES: 'colleges',
  MESSAGES: 'messages',
  POSTS: 'posts',
  APPLICATIONS: 'applications',
} as const;
