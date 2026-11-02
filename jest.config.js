module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|expo.*|@expo.*)/)',
  ],
  moduleNameMapper: {
    '^react-native/react-private-interface$': '<rootDir>/node_modules/react-native/Libraries/ReactPrivate/ReactNativePrivateInterface.js',
    '^react-native/setup-env$': '<rootDir>/node_modules/react-native/src/setup-env.js',
  },
};
