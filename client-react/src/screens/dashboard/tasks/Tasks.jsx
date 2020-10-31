import React, { Component, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../../helpers/auth";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleTaskSubmit = this.handleTaskSubmit.bind(this);

    this.state = {
      currentTaskProjectID: "",
      currentTaskProjectName: "",
      isVisible: true,
      isConfirmingRemove: false,
      isHoveringProject: false,
      isChangingProjectName: false,
      projectCreateEditName: "",
      taskCreateEditName: "",
      iconsAnimation: "hidden",
      mainAnimation: "panel-main stretch",
      footerAnimation: "panel-footer",
      projectsList: [],
      tasksList: [],
      isCreatingNewProject: false,
      isShowingProjectsList: false,
    };
    this.getConfigs();
  }

  getConfigs() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/configs/currentProject/${
          getCookie().token
        }`,
        {}
      )
      .then((res) => {
        if (res.data.project) {
          this.setState({
            currentTaskProjectID: res.data.project._id,
            currentTaskProjectName: res.data.project.name,
          });
          this.updateTaskList();
        } else {
          // No current Project Found, create one and set it to config
          const newProjectData = JSON.stringify({
            token: getCookie().token,
            name: "Inbox",
          });

          axios
            .post(`${process.env.REACT_APP_API_URL}/project/`, newProjectData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              // Set configuration
              const newProjectConfigData = JSON.stringify({
                token: getCookie().token,
                projectID: res.data.project._id,
              });

              this.setState({
                currentTaskProjectID: res.data.project._id,
                currentTaskProjectName: res.data.project.name,
              });

              axios
                .post(
                  `${process.env.REACT_APP_API_URL}/configs/currentProject`,
                  newProjectConfigData,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  this.getConfigs();
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.updateProjectList();
  }

  updateProjectList() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/project/${getCookie().token}`, {})
      .then((res) => {
        const removeIndex = res.data
          .map(function (item) {
            return item._id;
          })
          .indexOf(this.state.currentTaskProjectID);

        res.data.splice(removeIndex, 1);

        this.setState({ projectsList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateTaskList() {
    if (this.state.currentTaskProjectID == "") return;

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/task/${getCookie().token}/${
          this.state.currentTaskProjectID
        }`,
        {}
      )
      .then((res) => {
        this.setState({ tasksList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteCurrentTaskProject() {
    if (this.state.projectsList.length > 0) {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/project/${getCookie().token}/${
            this.state.currentTaskProjectID
          }`,
          {}
        )
        .then((res) => {
          this.updateProjectList();

          this.setState({
            currentTaskProjectID: this.state.projectsList[0]._id,
            currentTaskProjectName: this.state.projectsList[0].name,
          });

          //Update config in DB
          // Set configuration
          const newProjectConfigData = JSON.stringify({
            token: getCookie().token,
            projectID: this.state.projectsList[0]._id,
          });

          axios
            .post(
              `${process.env.REACT_APP_API_URL}/configs/currentProject`,
              newProjectConfigData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              console.log(res);
              this.getConfigs();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      this.setState({
        isConfirmingRemove: false,
      });
    } else {
      console.log("Cannot delete from a single project list");
    }
  }

  controlPanel = () => {
    if (!this.state.isVisible) {
      this.setState({
        mainAnimation: "panel-main stretch animate__animated animate__fadeIn",
        footerAnimation: "panel-footer animate__animated animate__fadeIn",
        isVisible: true,
      });
    } else {
      this.setState({
        mainAnimation: "panel-main normal animate__animated animate__fadeOut",
        footerAnimation: "panel-footer animate__animated animate__fadeOut",
        isVisible: false,
        isChangingProjectName: false,
      });
    }
  };

  handleMouseHover(event) {
    if (!this.state.isChangingProjectName) {
      this.setState({ isHoveringProject: event });
    }

    if (!this.state.isHoveringProject) {
      this.setState({
        iconsAnimation: "animate__animated animate__fadeIn",
      });
    } else {
      this.setState({
        iconsAnimation: "animate__animated animate__fadeOut",
      });
    }
  }

  handleMouseClick(event) {
    switch (event) {
      case "close-list":
        this.setState({ isShowingProjectsList: false });
        break;
      case "close":
        this.controlPanel();
        this.setState({
          isConfirmingRemove: false,
          isCreatingNewProject: false,
          projectCreateEditName: "",
        });
        break;
      case "edit":
        this.setState({
          isChangingProjectName: true,
          projectCreateEditName: this.state.currentTaskProjectName,
          isConfirmingRemove: false,
          mainAnimation: "panel-main stretch animate__animated animate__fadeIn",
          isVisible: true,
        });
        break;
      case "remove":
        this.setState({
          isConfirmingRemove: true,
          mainAnimation: "panel-main stretch animate__animated animate__fadeIn",
          isVisible: true,
        });
        break;
      case "cancel":
        this.setState({
          isConfirmingRemove: false,
          isCreatingNewProject: false,
          isChangingProjectName: false,
        });
        break;
      case "confirm":
        this.deleteCurrentTaskProject();
        break;
      case "editFinish":
        this.setState({
          isChangingProjectName: false,
          isConfirmingRemove: false,
        });
        break;
      case "toggleProjectList":
        this.setState({
          isShowingProjectsList: !this.state.isShowingProjectsList,
        });
        break;
      case "create":
        this.setState({
          isCreatingNewProject: true,
          isShowingProjectsList: false,
          projectCreateEditName: "",
          mainAnimation: "panel-main stretch animate__animated animate__fadeIn",
          isVisible: true,
        });
        break;
      default:
        break;
    }
  }

  handleProjectChange(e) {
    this.setState({ projectCreateEditName: e.target.value });
  }

  handleProjectSubmit(e) {
    e.preventDefault();

    if (this.state.isCreatingNewProject) {
      const createProjectData = JSON.stringify({
        token: getCookie().token,
        name: this.state.projectCreateEditName,
      });

      axios
        .post(`${process.env.REACT_APP_API_URL}/project/`, createProjectData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          this.setState({
            currentTaskProjectID: res.data.project._id,
            currentTaskProjectName: res.data.project.name,
          });

          //Update in DB
          // Set configuration
          const newProjectConfigData = JSON.stringify({
            token: getCookie().token,
            projectID: res.data.project._id,
          });

          axios
            .post(
              `${process.env.REACT_APP_API_URL}/configs/currentProject`,
              newProjectConfigData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              this.getConfigs();
            })
            .catch((err) => {
              console.log(err);
            });

          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.setState({
        isCreatingNewProject: false,
        currentTaskProjectName: this.state.projectCreateEditName,
      });
    } else if (this.state.isChangingProjectName) {
      const editProjectData = JSON.stringify({
        token: getCookie().token,
        name: this.state.projectCreateEditName,
      });

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/project/${this.state.currentTaskProjectID}`,
          editProjectData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.setState({
        isChangingProjectName: false,
        currentTaskProjectName: this.state.projectCreateEditName,
      });
    } else {
      console.log(
        "Error - attempt to submit without creating nor changing project"
      );
    }
  }

  handleTaskSubmit(e) {
    e.preventDefault();

    const createTaskData = JSON.stringify({
      token: getCookie().token,
      projectID: this.state.currentTaskProjectID,
      name: this.state.taskCreateEditName,
    });

    const array = this.state.tasksList;
    const newTask = {
      _id: "0",
      isDone: false,
      name: this.state.taskCreateEditName,
    };
    array.push(newTask);
    this.setState({ tasksList: array, taskCreateEditName: "" });

    axios
      .post(`${process.env.REACT_APP_API_URL}/task/`, createTaskData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.updateTaskList();
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("Submitted");
  }

  handleTaskChange(e) {
    this.setState({ taskCreateEditName: e.target.value });
  }

  setCurrentTaskProject(id, name) {
    this.setState({
      isShowingProjectsList: false,
      currentTaskProjectID: id,
      currentTaskProjectName: name,
    });
    const projectData = JSON.stringify({
      token: getCookie().token,
      projectID: id,
    });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/configs/currentProject`,
        projectData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        this.getConfigs();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleTaskIsDone(taskID) {
    const array = this.state.tasksList;

    for (var x = 0; x < array.length; x++) {
      if (array[x]._id === taskID) {
        const editTaskData = JSON.stringify({
          token: getCookie().token,
          name: array[x].name,
          isDone: !array[x].isDone,
        });

        array[x].isDone = !array[x].isDone;
        this.setState({ tasksList: array });

        axios
          .post(
            `${process.env.REACT_APP_API_URL}/task/${taskID}`,
            editTaskData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  deleteTask(taskID) {
    const array = this.state.tasksList;
    for (var x = 0; x < array.length; x++) {
      if (array[x]._id === taskID) {
        array.splice(x, 1);
      }
    }
    this.setState({ tasksList: array });

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/task/${getCookie().token}/${taskID}`,
        {}
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="panel panel-big panel-task">
        <div className="row panel-header">
          {this.state.isShowingProjectsList ? (
            <Fragment>
              <div className="col-md-auto panel-left edit-project">
                <ul>
                  <li key={this.state.currentTaskProjectID}>
                    <a onClick={() => this.handleMouseClick("close-list")}>
                      {this.state.currentTaskProjectName}
                    </a>
                  </li>
                  {this.state.projectsList.map(({ _id, name }) => (
                    <li className="project-list" key={_id}>
                      <a
                        onClick={() =>
                          this.handleMouseClick(
                            this.setCurrentTaskProject(_id, name)
                          )
                        }
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                  <li className="project-list">
                    <a onClick={() => this.handleMouseClick("create")}>
                      <i className="fas fa-plus fa-xs"></i> New Project
                    </a>
                  </li>
                </ul>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {this.state.isChangingProjectName ||
              this.state.isCreatingNewProject ? (
                // Edit/Create Project Input
                <div className="col-md-auto panel-left task-left edit-project">
                  <form onSubmit={this.handleProjectSubmit}>
                    <input
                      value={this.state.projectCreateEditName}
                      type="text"
                      className="project-name"
                      placeholder="Project Name"
                      onChange={this.handleProjectChange}
                      maxLength="12"
                    />
                    <a onClick={() => this.handleMouseClick("cancel")}>
                      {" "}
                      <i className="fas fa-window-close fa-xs"></i>
                    </a>
                  </form>
                </div>
              ) : (
                // Normal Project Appeareance
                <div
                  className="col panel-left"
                  onMouseEnter={() => this.handleMouseHover(true)}
                  onMouseLeave={() => this.handleMouseHover(false)}
                >
                  {this.state.projectsList.length > 0 ? (
                    <div className="inline">
                      {" "}
                      <a
                        onClick={() =>
                          this.handleMouseClick("toggleProjectList")
                        }
                        className="current-project"
                      >
                        {this.state.currentTaskProjectName}{" "}
                        <i className="fas fa-angle-down fa-xs"></i>{" "}
                      </a>
                    </div>
                  ) : (
                    <a className="current-project">
                      {this.state.currentTaskProjectName}{" "}
                    </a>
                  )}
                  <a
                    className={this.state.iconsAnimation}
                    onClick={() => this.handleMouseClick("edit")}
                  >
                    <i className="fas fa-edit fa-xs"></i>
                  </a>{" "}
                  {this.state.projectsList.length > 0 ? (
                    <a
                      className={this.state.iconsAnimation}
                      onClick={() => this.handleMouseClick("remove")}
                    >
                      <i className="fas fa-trash fa-xs"></i>
                    </a>
                  ) : null}
                  {"  "}
                  <a
                    className={this.state.iconsAnimation}
                    onClick={() => this.handleMouseClick("create")}
                  >
                    <i className="fas fa-plus fa-xs"></i>
                  </a>
                </div>
              )}
            </Fragment>
          )}

          <div className="col panel-right ">
            <a onClick={() => this.handleMouseClick("close")}>
              <i className="fas fa-caret-down"></i>
              <p> Tasks</p>
            </a>
          </div>
        </div>

        <div className={this.state.mainAnimation}>
          {this.state.isVisible ? (
            <Fragment>
              {this.state.isConfirmingRemove ? (
                <div>
                  <p>Are you sure you want to delete</p>
                  <p>{this.state.currentTaskProjectName}?</p>
                  <button
                    onClick={() => this.handleMouseClick("cancel")}
                    className="cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => this.handleMouseClick("confirm")}
                    className="confirm"
                  >
                    Yes, Delete
                  </button>
                </div>
              ) : (
                <div>
                  <div className="task-list">
                    <ul>
                      {this.state.tasksList.map(({ _id, name, isDone }) => (
                        <div>
                          <li key={_id.toString()}>
                            {isDone ? (
                              <Fragment>
                                {" "}
                                <a onClick={() => this.toggleTaskIsDone(_id)}>
                                  {" "}
                                  <div className="inline">
                                    <i className="fas fa-check-circle fa-xs align-baseline"></i>{" "}
                                  </div>
                                  <p className="dashed">{name}</p>
                                </a>
                              </Fragment>
                            ) : (
                              <Fragment>
                                {" "}
                                <a onClick={() => this.toggleTaskIsDone(_id)}>
                                  <div className="inline">
                                    <i className="fas fa-circle fa-xs align-baseline"></i>{" "}
                                  </div>
                                  {name}
                                </a>
                              </Fragment>
                            )}{" "}
                            <div className="task-icons">
                              <a>
                                {" "}
                                <i className="fas fa-edit fa-xs align-baseline"></i>
                              </a>{" "}
                              <a onClick={() => this.deleteTask(_id)}>
                                {" "}
                                <i className="fas fa-trash fa-xs align-baseline"></i>
                              </a>
                            </div>
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Fragment>
          ) : null}
        </div>
        {this.state.isVisible ? (
          <div className={this.state.footerAnimation}>
            <div className="new-task">
              <form onSubmit={this.handleTaskSubmit}>
                <input
                  value={this.state.taskCreateEditName}
                  type="text"
                  placeholder="New Task"
                  onChange={this.handleTaskChange}
                  maxLength="25"
                />
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Tasks;
