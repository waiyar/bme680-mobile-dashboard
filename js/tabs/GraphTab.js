import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Graph from '../charts/Graph';


export default class GraphTab extends React.Component {
    render() {
        return (
            <View style={styles.pageStyle}>
                <Graph width={400} height={400} data={this.props.data} colors={this.props.colors}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        // alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#373740',
        paddingTop: StatusBar.currentHeight
    },
});