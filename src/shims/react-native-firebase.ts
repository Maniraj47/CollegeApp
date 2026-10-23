// Shim for @react-native-firebase on Web

export namespace FirebaseFirestoreTypes {
  export interface Timestamp {
    seconds: number;
    nanoseconds: number;
    toDate(): Date;
    toMillis(): number;
  }

  export interface DocumentData {
    [field: string]: any;
  }
}

export const initializeApp = () => ({});
export const auth = () => ({
  currentUser: null,
  onAuthStateChanged: (cb: any) => () => {},
});
export const firestore = () => ({
  collection: (name: string) => ({}),
});

export default {
  initializeApp,
  auth,
  firestore,
};
