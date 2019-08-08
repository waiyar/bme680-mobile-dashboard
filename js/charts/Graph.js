import * as time from 'd3-time-format';
import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';
import { Text, View, Switch } from 'react-native';

const d3 = {
    time,
};
const parseTime = d3.time.utcParse("%Y-%m-%dT%H:%M:%SZ");
const formatTime = d3.time.timeFormat("%d/%m");

export default class Graph extends React.Component {
    state = {
        visible: [true, true, true]
    }

    hideLine = (index) => {
        this.setState({ visible: this.state.visible.map((d, i) => i == index ? !d : d) });
    }

    render() {
        if (this.props.data.temperature.length == 0) {
            return null;
        }

        let data = [[], [], []];    // Change array size depending on number of attribute.
        Object.keys(this.props.data).map((key, index) => {
            this.props.data[key].map((d, i) => {
                data[index][i] = { ts: parseTime(d.ts), value: d.value };
            });
            console.log(key);
        });
        // find maxima for normalizing data
        const maxima = data.map(
            dataset => Math.max(...dataset.map(d => d.value))
        );
        const minima = data.map(
            dataset => Math.min(...dataset.map(d => d.value))
        );
        const range = maxima.map((d, i) => (d - minima[i]));

        const labels = ['Humidity/%rH', 'Pressure/hPa','Temperature/°C']
        let xOffsets = [50, 200, 350];   // [50, 200, 350] for 3 lines
        const tickPadding = [0, 0, -20];   // [0, 0, -20] for 3
        const anchors = ["end", "end", "start"];
        const { colors } = this.props;
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                    paddingLeft: 30,
                    paddingRight: 30
                }}>
                    {
                        this.state.visible.map((d, i) => (
                            <Switch
                                key={'switch_' + i}
                                trackColor={{ true: colors[i] }}
                                onValueChange={() => this.hideLine(i)}
                                value={this.state.visible[i]}
                            />
                        ))
                    }
                </View>
                <VictoryChart
                    width={this.props.width}
                    theme={VictoryTheme.material}
                    height={this.props.height}
                    scale={{ x: "time", y: "linear" }}
                    domainPadding={{ y: [50, 50] }}
                    // animate={{ duration: 800 }}
                    domain={{ y: [0, 1] }}
                >
                    <VictoryAxis
                        // tickFormat={d => formatTime(d)}  // Uncomment if have multiple dates
                        tickCount={5}
                        style={{ tickLabels: { fill: "#ffffff" }, grid: { stroke: "none" } }}
                    />
                    {data.map((d, i) => (
                        <VictoryAxis dependentAxis
                            key={i}
                            offsetX={xOffsets[i]}
                            style={{
                                axis: { stroke: colors[i] },
                                ticks: { padding: tickPadding[i] },
                                tickLabels: { fill: colors[i], textAnchor: anchors[i] },
                                grid: { stroke: "none" }
                            }}
                            // Use normalized tickValues (0 - 1)
                            tickValues={[0.25, 0.5, 0.75, 1]}
                            tickFormat={(t) => Math.round((t * range[i] + minima[i]) * 100) / 100}
                            label={labels[i]}
                            axisLabelComponent={<VictoryLabel style={{ fill: 'white' }} y={50} angle={0} />}
                        />
                    ))}
                    {data.map((d, i) => {
                        if (this.state.visible[i]) {
                            return (
                                <VictoryLine
                                    key={i}
                                    data={d}
                                    style={{ data: { stroke: colors[i] } }}
                                    // normalize data
                                    interpolation='basis'
                                    x="ts"
                                    y={(datum) => (datum.value - minima[i]) / range[i]}
                                />
                            )
                        }
                    })}
                </VictoryChart>
                <Text style={{ color: 'white' }}>{formatTime(data[0][0].ts)} - {formatTime(data[0][data[0].length - 1].ts)}</Text>
            </View>
        )
    }

}
