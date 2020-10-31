import React, { Component, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../../helpers/auth";

class Daily extends Component {
  constructor(props) {
    super(props);

    this.handleFocusChange = this.handleFocusChange.bind(this);

    this.state = {
      givenName: "FILIPE",
      focus: "",
    };
  }

  getGivenName() {}

  handleFocusChange(event) {
    this.setState({ focus: event.target.value });
  }

  render() {
    return (
      <div className="daily-panel">
        <h1>HELLO {this.state.givenName} </h1>
        <h2>What's your Focus for today?</h2>
        <input
          className="focus-input"
          value={this.state.focus}
          type="text"
          placeholder=""
          onChange={this.handleFocusChange}
          maxLength="25"
        />
      </div>
    );
  }
}

export default Daily;
