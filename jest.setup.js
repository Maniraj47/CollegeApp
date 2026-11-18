jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

/* eslint-env jest */

jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  getConstants: () => ({
    settings: {},
  }),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithCredential: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signOut: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ docs: [] });
    return jest.fn();
  }),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      ScrollView,
      createAnimatedComponent: (comp) => comp,
    },
    LinearTransition: {
      springify: () => ({}),
    },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withSpring: (val) => val,
    withTiming: (val) => val,
  };
});

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const original = jest.requireActual('react-native/Libraries/TurboModule/TurboModuleRegistry');
  const mockPerformance = {
    now: jest.fn(() => Date.now()),
    markUrl: jest.fn(),
    reportMark: jest.fn(),
    reportMeasure: jest.fn(),
    getMarkTime: jest.fn(() => [0]),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    getEntries: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    getEventCounts: jest.fn(() => []),
    getSimpleMemoryInfo: jest.fn(() => ({})),
    getReactNativeStartupTiming: jest.fn(() => ({})),
    createObserver: jest.fn(() => 1),
    getDroppedEntriesCount: jest.fn(() => 0),
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => []),
    getSupportedPerformanceEntryTypes: jest.fn(() => []),
    clearEventCountsForTesting: jest.fn(),
    setResourceTimingBufferSize: jest.fn(),
  };

  return {
    ...original,
    getEnforcing: (name) => {
      if (name === 'NativePerformanceCxx' || name === 'NativePerformanceObserverCxx') {
        return mockPerformance;
      }
      try {
        return original.getEnforcing(name);
      } catch (e) {
        return {};
      }
    },
    get: (name) => {
      if (name === 'NativePerformanceCxx' || name === 'NativePerformanceObserverCxx') {
        return mockPerformance;
      }
      return original.get(name);
    },
  };
});
