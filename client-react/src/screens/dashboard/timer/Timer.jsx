import React, { Component, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../../helpers/auth";
import { auth } from "google-auth-library";
import BarChart from "./BarChart";
import moment from "moment";
var _ = require("lodash");

class Timer extends Component {
  constructor(props) {
    super(props);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleBreakTimeChange = this.handleBreakTimeChange.bind(this);
    this.handleSessionTimeChange = this.handleSessionTimeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.decreaseSecond = this.decreaseSecond.bind(this);
    this.play = this.play.bind(this);
    this.finishSession = this.finishSession.bind(this);
    this.handleWeekData = this.handleWeekData.bind(this);
    this.handleAllTimeData = this.handleAllTimeData.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);

    this.state = {
      mainAnimation: "panel-main center stretch",
      footerAnimation: "panel-footer",
      isVisible: true,
      isShowingConfigs: false,
      isShowingHistory: false,
      breakTime: 5,
      sessionTime: 25,
      timerMinute: 25,
      timerSecond: 0,
      isSession: true,
      intervalID: 0,
      isPlaying: false,
      timerList: [],
      isWeek: true,
      isAllTime: false,
      totalMinutes: 0,
      referenceMonth: 10,
      referenceYear: 2020,
    };
    this.getConfigs();
    this.getTimerList();
  }

  getConfigs() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/configs/timer/${getCookie().token}`,
        {}
      )
      .then((res) => {
        this.setState({
          breakTime: res.data.breakTime,
          sessionTime: res.data.sessionTime,
          timerMinute: res.data.sessionTime,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTimerList() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/timer/${getCookie().token}`, {})
      .then((res) => {
        this.setState({ timerList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  play() {
    if (!this.state.isPlaying) {
      let counter = setInterval(() => {
        this.decreaseSecond();
      }, 1000);
      this.setState({
        intervalID: counter,
        isPlaying: true,
        icon: "far fa-play-circle fa-3x",
      });
    } else {
      this.setState({ isPlaying: false, icon: "far fa-cog fa-3x" });
      clearInterval(this.state.intervalID);
    }
  }

  decreaseSecond() {
    switch (this.state.timerSecond) {
      case 0:
        if (this.state.timerMinute > 0) {
          this.setState({
            timerSecond: 59,
            timerMinute: this.state.timerMinute - 1,
          });
        } else {
          this.finishSession();
        }
        break;
      default:
        this.setState({ timerSecond: this.state.timerSecond - 1 });
        break;
    }
  }

  finishSession() {
    this.setState({ isPlaying: false });

    if (this.state.isSession) {
      this.saveTimer();

      this.setState({ isSession: false, timerMinute: this.state.breakTime });
    } else {
      this.setState({ isSession: true, timerMinute: this.state.sessionTime });
    }
    clearInterval(this.state.intervalID);
  }

  saveTimer() {
    const timerData = JSON.stringify({
      token: getCookie().token,
      minutes: this.state.sessionTime,
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/timer/`, timerData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        this.getTimerList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  controlPanel = () => {
    if (!this.state.isVisible) {
      this.setState({
        mainAnimation:
          "panel-main center stretch animate__animated animate__fadeIn",
        footerAnimation: "panel-footer animate__animated animate__fadeIn",
        isVisible: true,
      });
    } else {
      this.setState({
        mainAnimation:
          "panel-main center normal animate__animated animate__fadeOut",
        footerAnimation: "panel-footer animate__animated animate__fadeOut",
        isVisible: false,
        isChangingProjectName: false,
      });
    }
  };

  handleMouseClick(event) {
    switch (event) {
      case "week":
        this.setState({
          isWeek: true,
          isAllTime: false,
          totalMinutes: this.handleAcumulatedData(7),
        });
        break;
      case "alltime":
        this.setState({ isWeek: false, isAllTime: true });
        break;
      case "cancel":
        this.setState({ isShowingConfigs: false, isShowingHistory: false });
        break;
      case "config":
        if (!this.state.isVisible) {
          this.controlPanel();
        }
        this.setState({
          isShowingConfigs: !this.state.isShowingConfigs,
          isShowingHistory: false,
        });
        break;
      case "history":
        this.handleMouseClick("week");
        this.setState({
          isShowingHistory: !this.state.isShowingHistory,
          isShowingConfigs: false,
        });
        break;
      case "close":
        this.controlPanel();
        this.setState({ isShowingConfigs: false, isShowingHistory: false });
        break;
      default:
        break;
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      isShowingHistory: false,
      isShowingConfigs: false,
      timerMinute: this.state.sessionTime,
    });

    const timerData = JSON.stringify({
      token: getCookie().token,
      breakTime: this.state.breakTime,
      sessionTime: this.state.sessionTime,
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/configs/timer/`, timerData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Submitting");
  }

  handleBreakTimeChange(event) {
    this.setState({ breakTime: event.target.value });
  }

  handleSessionTimeChange(event) {
    this.setState({ sessionTime: event.target.value });
  }

  handleWeekData() {
    const labels = [];
    for (var x = 6; x > 0; x--) {
      labels.push(moment().subtract(x, "days").format("ddd"));
    }
    labels.push("Today");

    const days = [];

    for (var x = 6; x >= 0; x--) {
      var dayTimer = _.filter(this.state.timerList, function (each) {
        return moment(each.date).isBetween(
          moment().startOf("day").subtract(x, "days"),
          moment()
            .startOf("day")
            .subtract(x - 1, "days")
        );
      });

      days.push(dayTimer.length);
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: "",
          data: days,
          backgroundColor: "rgba(255, 255, 255)",
        },
      ],
    };

    return data;
  }

  handleAcumulatedData(days) {
    var weekTimers = _.filter(this.state.timerList, function (each) {
      return moment(each.date).isBetween(
        moment().startOf("day").subtract(days, "days"),
        moment().now
      );
    });

    var acumulatedTime = 0;
    for (var x = 0; x < weekTimers.length; x++) {
      acumulatedTime += weekTimers[x].minutes;
    }

    return acumulatedTime;
  }

  handleAllTimeData() {
    const labels = [];
    const dayCount = moment(
      this.state.referenceYear + "-" + this.state.referenceMonth,
      "YYYY-MM"
    ).daysInMonth();

    const days = [];
    for (var x = 1; x <= dayCount; x++) {
      labels.push(x);

      var beginDate = moment().format(
        this.state.referenceYear + "-" + this.state.referenceMonth + "-" + x
      );
      var endDate;
      if (x !== dayCount) {
        endDate = moment().format(
          this.state.referenceYear +
            "-" +
            this.state.referenceMonth +
            "-" +
            (x + 1)
        );
      } else {
        endDate = beginDate + moment().add(1, "days");
      }

      var dayTimer = _.filter(this.state.timerList, function (each) {
        return moment(each.date).isBetween(moment(beginDate), moment(endDate));
      });

      days.push(dayTimer.length);
    }

    const data = {
      labels: labels,
      datasets: [
        {
          label: "",
          data: days,
          backgroundColor: "rgba(255, 255, 255)",
        },
      ],
    };

    return data;
  }

  handleMonthChange(state) {
    switch (state) {
      case "previous":
        if (this.state.referenceMonth == 1) {
          this.setState({
            referenceMonth: 12,
            referenceYear: this.state.referenceYear - 1,
          });
        } else {
          this.setState({ referenceMonth: this.state.referenceMonth - 1 });
        }
        break;
      case "next":
        if (this.state.referenceMonth == 12) {
          this.setState({
            referenceMonth: 1,
            referenceYear: this.state.referenceYear + 1,
          });
        } else {
          this.setState({ referenceMonth: this.state.referenceMonth + 1 });
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="panel panel-big panel-timer">
        <div className="row panel-header">
          <div className="col panel-left">
            <a onClick={() => this.handleMouseClick("config")}>
              {" "}
              <i className="fas fa-cog"></i>
            </a>
          </div>
          <div className="col panel-right">
            <a onClick={() => this.handleMouseClick("close")}>
              <i className="fas fa-caret-down"></i>
              <p> Timer</p>
            </a>
          </div>
        </div>

        <div className={this.state.mainAnimation}>
          {this.state.isShowingConfigs || this.state.isShowingHistory ? (
            <Fragment>
              {this.state.isShowingConfigs ? (
                <Fragment>
                  <div className="col timer-config">
                    <form onSubmit={this.handleSubmit}>
                      <h1>Session Time</h1>
                      <center>
                        {" "}
                        <input
                          value={this.state.sessionTime}
                          type="text"
                          onChange={this.handleSessionTimeChange}
                          maxLength="3"
                          className="timer-value"
                        />
                        <h2> Minutes</h2>
                        <h1>Break Time</h1>
                        <input
                          value={this.state.breakTime}
                          type="text"
                          onChange={this.handleBreakTimeChange}
                          maxLength="3"
                          className="timer-value"
                        />
                        <h2> Minutes</h2>
                        <br></br>
                        <br></br>
                        <button
                          className="cancel"
                          onClick={() => this.handleMouseClick("cancel")}
                        >
                          Cancel
                        </button>
                        <button className="confirm">Confirm</button>
                      </center>
                    </form>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className={this.state.mainAnimation}>
                    {this.state.isWeek ? (
                      <div>
                        <p>This Week</p>
                        <BarChart data={this.handleWeekData} />
                        <br></br>
                        <p>Total Time:</p>
                        <p>
                          {parseInt(this.state.totalMinutes / 60)} hours and{" "}
                          {parseInt(this.state.totalMinutes % 60)} minutes
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="alltime-header">
                          <a onClick={() => this.handleMonthChange("previous")}>
                            <i className="fas fa-angle-left align-left"></i>
                          </a>
                          <p className="alltime-month">
                            {moment(
                              this.state.referenceYear +
                                "-" +
                                this.state.referenceMonth
                            ).format("MMMM-YYYY")}
                          </p>
                          <a onClick={() => this.handleMonthChange("next")}>
                            <i className="fas fa-angle-right align-right"></i>
                          </a>
                        </div>

                        <div className="alltime-main">
                          <BarChart data={this.handleAllTimeData} />
                        </div>
                      </div>
                    )}
                  </div>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <h1 id="timer-main-time">
                {" "}
                {this.state.timerMinute}:
                {this.state.timerSecond === 0
                  ? "00"
                  : this.state.timerSecond < 10
                  ? "0" + this.state.timerSecond
                  : this.state.timerSecond}
              </h1>
              <a onClick={this.play}>
                {this.state.isPlaying ? (
                  <i className="far fa-pause-circle fa-3x"></i>
                ) : (
                  <i className="far fa-play-circle fa-3x"></i>
                )}
              </a>
            </Fragment>
          )}
        </div>
        {this.state.isShowingHistory ? (
          <div className="panel-footer">
            <button
              className="timer-history-period"
              onClick={() => this.handleMouseClick("week")}
            >
              This Week
            </button>
            <button
              className="timer-history-period"
              onClick={() => this.handleMouseClick("alltime")}
            >
              All Time
            </button>
          </div>
        ) : null}
        {this.state.isVisible &&
        !this.state.isShowingHistory &&
        !this.state.isShowingConfigs ? (
          <div className={this.state.footerAnimation}>
            <div className="center"></div>
            <a onClick={() => this.handleMouseClick("history")}>
              <i className="fas fa-history"></i>
              <p>History</p>
            </a>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Timer;
