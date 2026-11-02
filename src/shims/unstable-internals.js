/**
 * Shim for 'react-native/unstable-internals-do-not-use'
 * Required when running Expo SDK 58 modules on React Native 0.85
 */
const AssetSourceResolver =
  require('react-native/Libraries/Image/AssetSourceResolver').default ||
  require('react-native/Libraries/Image/AssetSourceResolver');

let NativeExceptionsManager = null;
try {
  NativeExceptionsManager =
    require('react-native/Libraries/Core/NativeExceptionsManager').default ||
    require('react-native/Libraries/Core/NativeExceptionsManager');
} catch (_) {}

let NativeSourceCode = null;
try {
  NativeSourceCode =
    require('react-native/Libraries/NativeModules/specs/NativeSourceCode').default ||
    require('react-native/Libraries/NativeModules/specs/NativeSourceCode');
} catch (_) {}

let NativeRedBox = null;
try {
  NativeRedBox =
    require('react-native/Libraries/NativeModules/specs/NativeRedBox').default ||
    require('react-native/Libraries/NativeModules/specs/NativeRedBox');
} catch (_) {}

let DevLoadingView = null;
try {
  DevLoadingView =
    require('react-native/Libraries/Utilities/DevLoadingView').default ||
    require('react-native/Libraries/Utilities/DevLoadingView');
} catch (_) {}

module.exports = {
  AssetSourceResolver,
  NativeExceptionsManager,
  NativeSourceCode,
  NativeRedBox,
  DevLoadingView,
};

