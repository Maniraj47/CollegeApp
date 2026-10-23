// Shim for react-native-image-picker on Web

export interface Asset {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
}

export interface ImagePickerResponse {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Asset[];
}

export const launchImageLibrary = (
  options: any,
  callback?: (response: ImagePickerResponse) => void
): Promise<ImagePickerResponse> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options?.mediaType === 'video' ? 'video/*' : 'image/*';

    let didChoose = false;

    input.onchange = async () => {
      didChoose = true;
      const file = input.files?.[0];
      if (!file) {
        const res: ImagePickerResponse = { didCancel: true };
        callback?.(res);
        resolve(res);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip data:image/...;base64, prefix if base64 was requested
        const commaIdx = resultStr.indexOf(',');
        const base64Data = commaIdx !== -1 ? resultStr.slice(commaIdx + 1) : resultStr;
        const objectUrl = URL.createObjectURL(file);

        const res: ImagePickerResponse = {
          assets: [
            {
              uri: objectUrl,
              base64: base64Data,
              fileName: file.name,
              fileSize: file.size,
              type: file.type,
            },
          ],
        };
        callback?.(res);
        resolve(res);
      };

      reader.onerror = () => {
        const res: ImagePickerResponse = {
          errorCode: 'OTHERS',
          errorMessage: 'Failed to read file',
        };
        callback?.(res);
        resolve(res);
      };

      reader.readAsDataURL(file);
    };

    // Clean up if cancelled
    window.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!didChoose && (!input.files || input.files.length === 0)) {
            const res: ImagePickerResponse = { didCancel: true };
            callback?.(res);
            resolve(res);
          }
        }, 500);
      },
      { once: true }
    );

    input.click();
  });
};

export const launchCamera = launchImageLibrary;
