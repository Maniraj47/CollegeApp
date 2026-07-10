import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// The Firebase SDK is initialized natively via GoogleService-Info.plist and google-services.json.
// However, we can export the instances here for easy access across the app.

export const fbAuth = auth();
export const db = firestore();

// Helper to get typed collections
export const getCollection = <T>(collectionName: string) => {
  return db.collection(collectionName) as unknown as ReturnType<typeof db.collection>;
};
