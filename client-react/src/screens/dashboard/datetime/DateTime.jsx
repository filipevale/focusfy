import React, { Component } from "react";
import moment from "moment";

class DateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: "",
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      currentTime: moment().format("LT"),
    });
  }

  render() {
    return (
      <div className="date-time">
        <h1>{this.state.currentTime} </h1>
        <h2>
          {moment().format("dddd").toUpperCase()},
          {moment().format("MMMM").toUpperCase()} {moment().format("D")}
        </h2>
      </div>
    );
  }
}

export default DateTime;
