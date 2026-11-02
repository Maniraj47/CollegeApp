import { Platform } from 'react-native';

export interface ImagePickerAsset {
  uri?: string;
  base64?: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
}

export interface ImagePickerResponse {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: ImagePickerAsset[];
}

export const launchImageLibrary = async (options: {
  mediaType?: 'photo' | 'video' | 'mixed';
  quality?: number;
  includeBase64?: boolean;
} = {}): Promise<ImagePickerResponse> => {
  // 1. Try Expo Image Picker first (works inside Expo Go & on modern setups)
  try {
    const ExpoPicker = require('expo-image-picker');
    if (ExpoPicker && typeof ExpoPicker.launchImageLibraryAsync === 'function') {
      const res = await ExpoPicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: options.quality ?? 0.8,
        base64: options.includeBase64 ?? true,
      });

      if (res.canceled) {
        return { didCancel: true };
      }

      return {
        didCancel: false,
        assets: (res.assets || []).map((a: any) => ({
          uri: a.uri,
          base64: a.base64,
          fileName: a.fileName,
          fileSize: a.fileSize,
          type: a.mimeType,
        })),
      };
    }
  } catch (_) {
    // Fall back to native image picker if expo-image-picker fails
  }

  // 2. Try bare React Native Image Picker
  try {
    const RNImagePicker = require('react-native-image-picker');
    if (RNImagePicker && typeof RNImagePicker.launchImageLibrary === 'function') {
      return await RNImagePicker.launchImageLibrary({
        mediaType: options.mediaType || 'photo',
        quality: options.quality ?? 0.8,
        includeBase64: options.includeBase64 ?? true,
      });
    }
  } catch (_) {}

  return { didCancel: true, errorMessage: 'No image picker available in runtime' };
};

export default {
  launchImageLibrary,
};
