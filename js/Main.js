import React from 'react';
import { Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import GraphTab from './tabs/GraphTab';
import GaugeTab from './tabs/GaugeTab';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Navigation } from 'react-native-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createAppContainer } from 'react-navigation';

import * as cred from '../credentials.json';

const AppNavigator = createMaterialBottomTabNavigator(
    {
        Gauge: {
            screen: (props) => <GaugeTab data={props.screenProps.latestValues} colors={props.screenProps.colors}/>,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Entypo name='gauge' color={tintColor} size={25} />
                )
            }
        },
        Graph: {
            screen: (props) => <GraphTab data={props.screenProps.data} colors={props.screenProps.colors}/>,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name='areachart' color={tintColor} size={25} />
                )
            }
        },
    },
    {
        initialRouteName: "Gauge",
        activeColor: '#ffffff',
        inactiveColor: '#adadb1',
        barStyle: { backgroundColor: '#33333d' },
    }
);

const AppContainer = createAppContainer(AppNavigator);

const thingKey = "bme-680";

export default class Main extends React.Component {
    state = {
        isLoading: false,
        colors: ["#44ea70", "#ffa916", "#4298f4"],
        data: {
            temperature: [],
            pressure: [],
            humidity: []
        },
        latestValues: {},
        url: "http://api-dev.devicewise.com/api",
        authenticate: {
            "auth": {
                "command": "api.authenticate",
                "params": {
                    "username": cred.username,
                    "password": cred.password
                }
            }
        },
        sessionId: "",
        request: {
            "temperature": {
                "command": "property.history",
                "params": {
                    "thingKey": thingKey,
                    "key": "temperature",
                    "records": 100
                }
            },
            "pressure": {
                "command": "property.history",
                "params": {
                    "thingKey": thingKey,
                    "key": "pressure",
                    "records": 100
                }
            },
            "humidity": {
                "command": "property.history",
                "params": {
                    "thingKey": thingKey,
                    "key": "humidity",
                    "records": 100
                }
            }
        },
    }

    componentDidMount() {
        this.setState(({ isLoading: true }));
        fetch(this.state.url, {
            method: 'POST',
            body: JSON.stringify(this.state.authenticate)
        }).then(res => res.json())
            .then(res => {
                if (res.auth.success) {
                    return (fetch(this.state.url, {
                        method: "POST",
                        body: JSON.stringify(this.state.request),
                        headers: { "sessionId": res.auth.params.sessionId }
                    }));
                }
            })
            .then(res => res.json())  // Second fetch
            .then(data => {
                this.setState(() => {
                    let updateData = {};
                    let lastValues = {};
                    for(var property in data) {
                        // prop = temp/pressure/humidity
                        if(data[property].success) {
                            updateData[property] = data[property].params.values;
                            lastValues[property] = updateData[property][updateData[property].length - 1].value;
                        }
                    }
                    return {data: updateData, latestValues: lastValues};
                }, () => {
                    /* Animated.timing(
                        this.state.gaugeAnim,
                        {
                            toValue: this.state.value,
                            duration: 1000
                        }
                    ).start(); */

                });
            })
            .catch(err => console.error("Error: ", err));
    }

    componentDidUpdate() {
        if (this.state.isLoading) {
            //this.animation.play();
        }
    }

    render() {
        return <AppContainer screenProps={{latestValues: this.state.latestValues, data: this.state.data, colors: this.state.colors}} />;
    }
}

/* // Loader
<View>
    {this.state.isLoading &&
        <LottieView
            ref={animation => {
                this.animation = animation;
            }}
            style={{
                width: 450,
                height: 400,
            }}
            source={require('../assets/animation')}
        />
    }
    {!this.state.isLoading &&
        <Graph width={450} height={400} data={this.state.data} />
    }
</View> */

/* {
    data: data.temperature.params.values.map(d => (
        { date: d.ts, value: d.value }
    )),
    value: data.temperature.params.values[data.temperature.params.values.length - 1].value,
    isLoading: false,
} */