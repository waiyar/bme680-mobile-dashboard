import React from 'react';
import { View, Text, StatusBar, Animated, StyleSheet } from 'react-native';
import Gauge from '../charts/Gauge';
import LottieView from 'lottie-react-native';


const AnimatedGauge = Animated.createAnimatedComponent(Gauge);

export default class GaugeTab extends React.Component {
    state = {
        temperature: new Animated.Value(10),
        pressure: new Animated.Value(500),
        humidity: new Animated.Value(0),
        isLoading: true
    }

    shouldComponentUpdate(nextProps) {
        if (Object.entries(nextProps.data).length != 0) {
            let data = nextProps.data;
            if (this.animation != null) {
                this.animation.reset();
            }
            if (this.state.isLoading) {
                this.setState({ isLoading: false }, () => {
                    // for (var property in data) {
                    //     Animated.timing(
                    //         this.state[property],
                    //         {
                    //             toValue: data[property],
                    //             duration: 1000
                    //         }
                    //     ).start();
                    // }
                    Animated.parallel([
                        Animated.timing(this.state.temperature, {
                            toValue: data.temperature,
                            duration: 1000,
                        }),
                        Animated.timing(this.state.pressure, {
                            toValue: data.pressure,
                            duration: 1000,
                        }),
                        Animated.timing(this.state.humidity, {
                            toValue: data.humidity,
                            duration: 1000,
                        })
                    ]).start();
                    // Animated.timing(
                    //     this.state.humidity,
                    //     {
                    //         toValue: data.humidity,
                    //         duration: 1000,
                    //     }
                    // ).start();
                });
            }
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.animation.play();
    }
    render() {
        return (
            <View style={styles.pageStyle}>
                {this.state.isLoading &&
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={{
                            width: 450,
                            height: 400,
                        }}
                        source={require('../../assets/animation')}
                    />
                }
                {!this.state.isLoading &&
                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, color: this.props.colors[0] }}>Temperature</Text>
                            <View style={{ height: 150 }}>
                                <AnimatedGauge width={250} height={250} domain={[10, 80]} value={this.state.temperature} unit="°C" />
                            </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, color: this.props.colors[1] }}>Pressure</Text>
                            <View style={{ height: 150 }}>
                                <AnimatedGauge width={250} height={250} domain={[500, 2000]} value={this.state.pressure} unit="hPa" />
                            </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 22, color: this.props.colors[2] }}>Humidity</Text>
                            <View style={{ height: 150 }}>
                                <AnimatedGauge width={250} height={250} domain={[0, 100]} value={this.state.humidity} unit="%rH" />
                            </View>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        alignItems: 'center',
        backgroundColor: '#373740',
        flex: 1,
        justifyContent: 'space-evenly',
        paddingTop: StatusBar.currentHeight
    },
});