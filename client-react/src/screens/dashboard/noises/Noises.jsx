import React, { Component, Fragment } from "react";
import ReactHowler from "react-howler";
import Rain from "./rain.mp3";
import Birds from "./birds.mp3";
import Wind from "./wind.mp3";
import Fire from "./bonfire.mp3";
import Forest from "./forest.mp3";
import Thunder from "./thunder.mp3";
import Coffee from "./coffee.mp3";
import Night from "./night.mp3";
import Creek from "./creek.mp3";
import Waves from "./waves.mp3";

class Noises extends Component {
  constructor(props) {
    super(props);

    this.handleMainVolumeChange = this.handleMainVolumeChange.bind(this);

    this.state = {
      mainAnimation: "panel-main center stretch-noises",
      isVisible: true,
      isMute: false,
      previousMainVolume: 50,
      mainVolume: 0.5,
      noiseList: [],
      isShowingNoiseList: false,
    };
  }

  componentDidMount() {
    const list = [];

    const noise0 = {
      index: 0,
      noiseURL: Rain,
      noiseIcon: "fas fa-cloud-rain",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise1 = {
      index: 1,
      noiseURL: Birds,
      noiseIcon: "fas fa-dove",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise2 = {
      index: 2,
      noiseURL: Wind,
      noiseIcon: "fas fa-wind",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise3 = {
      index: 3,
      noiseURL: Fire,
      noiseIcon: "fas fa-fire",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise4 = {
      index: 4,
      noiseURL: Forest,
      noiseIcon: "fas fa-tree",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise5 = {
      index: 5,
      noiseURL: Thunder,
      noiseIcon: "fas fa-bolt",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise6 = {
      index: 6,
      noiseURL: Coffee,
      noiseIcon: "fas fa-coffee",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise7 = {
      index: 7,
      noiseURL: Night,
      noiseIcon: "fas fa-moon",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise8 = {
      index: 8,
      noiseURL: Creek,
      noiseIcon: "fas fa-tint",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    const noise9 = {
      index: 9,
      noiseURL: Waves,
      noiseIcon: "fas fa-water",
      noiseVolume: 0.5,
      isPlaying: false,
    };

    list.push(noise0);
    list.push(noise1);
    list.push(noise2);
    list.push(noise3);
    list.push(noise4);
    list.push(noise5);
    list.push(noise6);
    list.push(noise7);
    list.push(noise8);
    list.push(noise9);
    this.setState({ noiseList: list });
  }

  controlPanel = () => {
    if (!this.state.isVisible) {
      this.setState({
        mainAnimation:
          "panel-main center stretch-noises animate__animated animate__fadeIn",
        isVisible: true,
      });
    } else {
      this.setState({
        mainAnimation:
          "panel-main center normal animate__animated animate__fadeOut",
        isVisible: false,
      });
    }
  };

  handleMouseClick(event) {
    switch (event) {
      case "close":
        this.controlPanel();
        break;
      case "mute":
        console.log("Muting");
        if (!this.state.isMute) {
          this.setState({
            previousMainVolume: this.state.mainVolume,
            isMute: true,
            mainVolume: 0,
          });
        } else {
          this.setState({
            mainVolume: this.state.previousMainVolume,
            isMute: false,
          });
        }
        break;
      default:
        break;
    }
  }

  handleMainVolumeChange(event) {
    this.setState({ mainVolume: event.target.value, isMute: false });
  }

  handleSmallVolume(index, event) {
    const list = this.state.noiseList;
    list[index].noiseVolume = event.target.value;

    this.setState({ noiseList: list });
  }

  handleNoiseToggle(index) {
    const list = this.state.noiseList;
    list[index].isPlaying = !list[index].isPlaying;

    this.setState({ noiseList: list });
  }

  render() {
    return (
      <div className="panel panel-noises">
        <div className="row panel-header">
          <div className="col panel-left">
            <a onClick={() => this.handleMouseClick("mute")}>
              {this.state.isMute ? (
                <i className="fas fa-volume-mute"></i>
              ) : (
                <i className="fas fa-volume-up"></i>
              )}
            </a>

            <div className="main-volume">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={this.state.mainVolume}
                className="slider slider-big"
                onChange={this.handleMainVolumeChange}
              />
            </div>
          </div>
          <div className="col panel-right">
            <a onClick={() => this.handleMouseClick("close")}>
              <i className="fas fa-caret-down"></i>
              <p> Noises</p>
            </a>
          </div>
        </div>

        <div className={this.state.mainAnimation}>
          {this.state.isVisible ? (
            <Fragment>
              <div className="noise-main">
                <div className="row noise-main-row">
                  {this.state.noiseList.map(
                    ({
                      index,
                      noiseURL,
                      noiseVolume,
                      noiseIcon,
                      isPlaying,
                    }) => (
                      <div className="noise">
                        {isPlaying ? (
                          <Fragment>
                            <ReactHowler
                              src={noiseURL}
                              playing={true}
                              volume={noiseVolume * this.state.mainVolume}
                              loop={true}
                            />
                            <a onClick={() => this.handleNoiseToggle(index)}>
                              <i className={noiseIcon}></i>
                            </a>
                            <br />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={this.state.noiseList[index].noiseVolume}
                              className="slider slider-small"
                              onChange={(e) => this.handleSmallVolume(index, e)}
                            />
                          </Fragment>
                        ) : (
                          <Fragment>
                            <a onClick={() => this.handleNoiseToggle(index)}>
                              <i className={noiseIcon + " grey"}></i>
                            </a>
                            <br />
                          </Fragment>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Noises;
