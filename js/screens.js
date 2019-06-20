import { Navigation } from 'react-native-navigation';

export function registerScreens() {
    Navigation.registerComponent('Gauge', () => require('./tabs/GaugeTab').default);
    Navigation.registerComponent('Graph', () => require('./tabs/GraphTab').default);
}