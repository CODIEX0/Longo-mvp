import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './src/App';

// Set environment variables
process.env.EXPO_OS = process.env.EXPO_OS || 'web';
process.env.TAMAGUI_TARGET = 'native';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
