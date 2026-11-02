/**
 * @format
 */

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('CollegeApp', () => App);
// It ensures that whether you load the app in Expo Go or in a bare native build,
// the environment is set up appropriately.
registerRootComponent(App);
