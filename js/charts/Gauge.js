import React, { Component } from 'react';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as color from 'd3-scale-chromatic';
import Svg, { Path, G, Text } from 'react-native-svg';

const d3 = {
    scale,
    shape,
    color,
};

const path = d3.shape.arc()
    .outerRadius(100)
    .innerRadius(60)
    .startAngle(-(Math.PI / 2));

const colorScale = d3.scale
    .scaleSequential(d3.color.interpolateRdYlGn)

const gaugeScale = d3.scale.scaleLinear()
    .range([-(Math.PI / 2), Math.PI / 2]);

export default class Gauge extends Component {
    render() {
        let domain = this.props.domain;
        colorScale.domain([domain[1], domain[0]]);
        gaugeScale.domain(domain);

        return (
            <Svg
                width={this.props.width}
                height={this.props.height}>
                <G
                    x={this.props.width / 2}
                    y={this.props.height / 2}
                >
                    <Path
                        d={path({ "endAngle": Math.PI / 2 })}
                        stroke={"#98a5ba"}
                        strokeWidth={3}
                        fill={"#98a5ba"}
                    />
                    <Path
                        d={path({ "endAngle": gaugeScale(this.props.value) })}
                        stroke={colorScale(this.props.value)}
                        strokeWidth={3}
                        fill={colorScale(this.props.value)}
                    />
                </G>
                <Text
                    fill="white"
                    fontSize="20"
                    textAnchor="middle"
                    stroke="white"
                    x={this.props.width / 2}
                    y={this.props.height / 2}
                >{Number.parseFloat(this.props.value).toFixed(1) + this.props.unit}</Text>
            </Svg>
        );
    }
}

