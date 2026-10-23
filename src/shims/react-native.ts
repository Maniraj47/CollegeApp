import * as RNWeb from 'react-native-web';

export * from 'react-native-web';

export const TurboModuleRegistry = {
  get: (_name: string) => null,
  getEnforcing: (_name: string) => null,
};

const extended = {
  ...RNWeb,
  TurboModuleRegistry,
};

export default extended;
