import React, { Component } from "react";
import weatherIconsCSS from "../../../assests/weather-icons.min.css";

class Weather extends Component {
  render() {
    return (
      <div>
        <i className={this.props.icon}></i>
        <p>
          {" "}
          {this.props.mainTemp}
          {this.props.unit}
        </p>
      </div>
    );
  }
}

export default Weather;
