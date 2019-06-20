import { Navigation } from 'react-native-navigation';
import { registerScreens } from './js/screens';

export default function start() {
    registerScreens();

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: {
                bottomTabs: {
                    id: 'BottomTabsId',
                    children: [
                        {
                            stack: {
                                children: [],
                                options: {
                                    bottomTab: {
                                        text: 'Tab 1',
                                        //icon:
                                    }
                                }
                            }
                        },
                        {
                            component: {
                                name: 'secondTabScreen',
                                options: {
                                    bottomTab: {
                                        text: 'Tab 2',
                                        //icon: require('../images/two.png')
                                    }
                                }
                            }
                        }
                    ],
                }
            },
        });
    });
}
