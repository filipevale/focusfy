import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { defaults } from "react-chartjs-2";

defaults.global.defaultFontColor = "rgb(255, 255, 255)";
defaults.global.legend.display = false;

class BarChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = {
      defaultFontColor: "rgb(255, 0, 0)",
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              stepSize: 1,
            },
            gridLines: {
              color: "rgb(255, 255, 255, 0.25)",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 0,
              stepSize: 1,
            },
            gridLines: {
              color: "rgb(255, 255, 255, 0.25)",
            },
          },
        ],
      },
    };

    return (
      <div className="chart">
        <Bar data={this.props.data} options={options} />
      </div>
    );
  }
}

export default BarChart;
