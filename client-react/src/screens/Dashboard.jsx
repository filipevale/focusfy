import React, { Component, Fragment } from "react";
import DashboardCSS from "../assests/dashboard.style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./dashboard/weather/Weather";
import DateTime from "./dashboard/datetime/DateTime";
import Tasks from "./dashboard/tasks/Tasks";
import Timer from "./dashboard/timer/Timer";
import Noises from "./dashboard/noises/Noises";
import Notes from "./dashboard/notes/Notes";
import Daily from "./dashboard/Daily/Daily";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: "",
    };
  }

  render() {
    return (
      <Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col maincol">
              <Weather />
              <Tasks />
              <Timer />
            </div>

            <div className="col-6 maincol">
              <Daily />
            </div>
            <div className="col maincol maincol-right">
              <DateTime />
              <Noises />
              <Notes />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
