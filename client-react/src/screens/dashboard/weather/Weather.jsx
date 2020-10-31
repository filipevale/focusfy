import React, { Fragment } from "react";
import { Component } from "react";
import WeatherInfo from "./WeatherInfo";
import WeatherPanel from "./WeatherPanel";
import moment from "moment";
import { parseIcon } from "../../../helpers/weatherIconParser";

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasWeatherData: false,
      isVisible: false,
      isAnimationVisible: false,
      mainTemp: 0,
      unit: "",
      location: "",
      weather: "",
      icon: "",
      forecast: [{ date: "", icon: "", temp: "" }],
      animation: "",
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getLocation = this.getLocation.bind(this);
    }

  componentDidMount() {
    this.getLocation();
  }

  getWeatherData(lat, lon) {
    // Current
    fetch(
      `http://${process.env.REACT_APP_WEATHER_FORECAST_URI}/daily?lat=${lat}&lon=${lon}&key=${process.env.REACT_APP_WEATHER_KEY}`
    )
      .then((res) => res.json())
      .then((result) => {
        try {
          // Today
          this.setState({
            mainTemp: result.data[0].temp,
            weather: result.data[0].weather.description,
            icon: parseIcon(result.data[0].weather.code, moment().format("HH")),
            location: result.city_name,
            unit: "°C",
          });

          const forecastData = [
            {
              date: "",
              icon: "",
              temp: "",
            },
          ];

          // Forecast
          for (var x = 1; x <= 5; x++) {
            const daily = {
              date: moment(result.data[x].datetime).format("ddd").toUpperCase(),
              icon: parseIcon(result.data[x].weather.code),
              temp: Math.round(result.data[x].temp),
            };
            forecastData.push(daily);
          }
          this.setState({ forecast: forecastData, hasWeatherData: true });
        } catch (error) {
          this.setState({
            hasWeatherData: false,
          });
          console.log(error);
        }
      });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.handleLocationError
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }

  getCoordinates(position) {
    this.getWeatherData(position.coords.latitude, position.coords.longitude);
  }

  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get the user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("Unknown Error");
        break;
      default:
        console.log("Unknown Error");
        break;
    }
  }

  handleChange() {
    if (this.state.isVisible) {
      this.setState({
        animation: "panel weather animate__animated animate__slideOutLeft",
      });
      setTimeout(() => {
        this.setState({ isVisible: false });
      }, 250);
    } else {
      this.setState({
        animation: "panel weather animate__animated animate__slideInLeft",
        isVisible: true,
      });
    }
  }

  render() {
    return (
      <Fragment>
        {this.state.hasWeatherData ? (
          <Fragment>
            <div className="weather-info" onClick={() => this.handleChange()}>
              <WeatherInfo
                icon={this.state.icon}
                mainTemp={Math.round(this.state.mainTemp)}
                unit={this.state.unit}
              />
            </div>
            {this.state.isVisible ? (
              <WeatherPanel
                animation={this.state.animation}
                location={this.state.location}
                mainTemp={Math.round(this.state.mainTemp)}
                mainIcon={this.state.icon}
                weather={this.state.weather}
                unit={this.state.unit}
                forecast={this.state.forecast}
              />
            ) : null}
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

export default Weather;
