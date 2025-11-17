import { Platform } from 'react-native';

// Only import gesture handler on native platforms (not web)
if (Platform.OS !== 'web') {
  require('react-native-gesture-handler');
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
