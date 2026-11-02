const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for Expo and React Native
 */
const config = getDefaultConfig(__dirname);

const SHIM_UNSTABLE_INTERNALS = path.resolve(__dirname, 'src/shims/unstable-internals.js');
const ASSET_REGISTRY_PATH = path.resolve(__dirname, 'node_modules/react-native/Libraries/Image/AssetRegistry.js');

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/unstable-internals-do-not-use') {
    return {
      filePath: SHIM_UNSTABLE_INTERNALS,
      type: 'sourceFile',
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
