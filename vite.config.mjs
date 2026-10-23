import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const currentDir = import.meta.dirname;

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
  ],
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  resolve: {
    alias: [
      {
        find: /react-native-screens\/lib\/module\/components\/tabs\/screen\/TabsScreen/,
        replacement: path.resolve(currentDir, 'node_modules/react-native-screens/lib/module/components/tabs/screen/TabsScreen.web.js'),
      },
      {
        find: /react-native-screens\/lib\/module\/components\/tabs\/host\/TabsHost/,
        replacement: path.resolve(currentDir, 'node_modules/react-native-screens/lib/module/components/tabs/host/TabsHost.web.js'),
      },
      {
        find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent/,
        replacement: path.resolve(currentDir, 'src/shims/react-native-internals.ts'),
      },
      {
        find: /^react-native\/Libraries\/Renderer\/shims\/ReactFabric/,
        replacement: path.resolve(currentDir, 'src/shims/react-native-internals.ts'),
      },
      {
        find: /^react-native\/Libraries\/ReactNative\/AppContainer/,
        replacement: path.resolve(currentDir, 'src/shims/react-native-internals.ts'),
      },
      {
        find: /^react-native$/,
        replacement: path.resolve(currentDir, 'src/shims/react-native.ts'),
      },
      {
        find: /^@react-native-google-signin\/google-signin$/,
        replacement: path.resolve(currentDir, 'src/shims/google-signin.web.ts'),
      },
      {
        find: /^react-native-image-picker$/,
        replacement: path.resolve(currentDir, 'src/shims/image-picker.web.ts'),
      },
      {
        find: /^@react-native-firebase\/.*$/,
        replacement: path.resolve(currentDir, 'src/shims/react-native-firebase.ts'),
      },
    ],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
  optimizeDeps: {
    exclude: ['react-native', 'react-native-screens'],
  },
  server: {
    port: 3000,
    host: true,
  },
});
