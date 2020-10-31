import React, { Component } from "react";

class Weather extends Component {
  render() {
    return (
      <div className={this.props.animation}>
        <div className="weather-header">
          <div className="row">
            <div className="col-8">
              <h1>{this.props.location}</h1>
              <h2>{this.props.weather}</h2>
            </div>
            <div className="col-4 currentWeather">
              <h1>
                {this.props.mainTemp} {this.props.unit}
              </h1>
              <i className={this.props.mainIcon}></i>
            </div>
          </div>
        </div>
        <div className="weather-footer">
          <div className="row">
            <div className="col daily">
              {this.props.forecast[1].date}
              <br />
              <i className={this.props.forecast[1].icon}></i>
              <br />
              {this.props.forecast[1].temp}
              {this.props.unit}
            </div>
            <div className="col daily">
              {this.props.forecast[2].date}
              <br />
              <i className={this.props.forecast[2].icon}></i>
              <br />
              {this.props.forecast[2].temp}
              {this.props.unit}
            </div>
            <div className="col daily">
              {this.props.forecast[3].date}
              <br />
              <i className={this.props.forecast[3].icon}></i>
              <br />
              {this.props.forecast[3].temp}
              {this.props.unit}
            </div>
            <div className="col daily">
              {this.props.forecast[4].date}
              <br />
              <i className={this.props.forecast[4].icon}></i>
              <br />
              {this.props.forecast[4].temp}
              {this.props.unit}
            </div>
            <div className="col daily">
              {this.props.forecast[5].date}
              <br />
              <i className={this.props.forecast[5].icon}></i>
              <br />
              {this.props.forecast[5].temp}
              {this.props.unit}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
