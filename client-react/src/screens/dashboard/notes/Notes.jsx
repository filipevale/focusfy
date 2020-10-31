import React, { Component, Fragment } from "react";
import axios from "axios";
import { getCookie } from "../../../helpers/auth";
import { times } from "lodash";

class Notes extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      mainAnimation: "panel-main center stretch",
      isVisible: true,
      noteList: [],
      currentNote: "",
      currentNoteID: "",
      intervalID: 0,
      isShowingList: false,
    };

    this.getNotes();
  }

  getNotes() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/note/${getCookie().token}`, {})
      .then((res) => {
        this.setState({ noteList: res.data });
        this.getCurrentNote();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCurrentNote() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/configs/currentNote/${
          getCookie().token
        }`,
        {}
      )
      .then((res) => {
        const currentNote = this.state.noteList.find(
          (x) => x._id === res.data.note._id
        );
        this.setState({
          currentNoteID: res.data.note._id,
          currentNote: currentNote.text,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    this.setState({ currentNote: event.target.value });
    clearInterval(this.state.intervalID);

    let counter = setInterval(() => {
      this.saveNote();
    }, 1000);
    this.setState({
      intervalID: counter,
    });
  }

  saveNote() {
    clearInterval(this.state.intervalID);

    const noteData = JSON.stringify({
      token: getCookie().token,
      text: this.state.currentNote,
    });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/note/${this.state.currentNoteID}`,
        noteData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        this.editCurrentNote(res.data.note._id);
        this.getNotes();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleNoteChange(id) {
    this.editCurrentNote(id);
    const currentNote = this.state.noteList.find((x) => x._id === id);
    this.setState({
      currentNoteID: id,
      currentNote: currentNote.text,
      isShowingList: false,
    });
  }

  editCurrentNote(id) {
    const noteData = JSON.stringify({
      token: getCookie().token,
      noteID: id,
    });

    axios
      .post(`${process.env.REACT_APP_API_URL}/configs/currentNote/`, noteData, {
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
  }

  controlPanel = () => {
    if (!this.state.isVisible) {
      this.setState({
        mainAnimation:
          "panel-main center stretch animate__animated animate__fadeIn",
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
      case "new":
        this.setState({
          currentNote: "",
          currentNoteID: "",
          isShowingList: false,
        });
        break;
      case "list":
        this.setState({ isShowingList: true });
        break;
      case "back":
        this.setState({ isShowingList: false });
        break;
      case "close":
        this.controlPanel();
        break;
      default:
        break;
    }
  }

  deleteNote(id) {
    const currentNote = this.state.noteList.find((x) => x._id === id);
    const list = this.state.noteList;
    var index = list.findIndex((x) => x._id === id);
    list.splice(index, 1);

    this.setState({ noteList: list });

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/note/${getCookie().token}/${id}`,
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
      <div className="panel panel-notes">
        <div className="row panel-header">
          <div className="col panel-left">
            <a onClick={() => this.handleMouseClick("new")}>
              <i className="fas fa-plus"></i>
            </a>{" "}
            {this.state.isShowingList ? (
              <a onClick={() => this.handleMouseClick("back")}>
                <i className="fas fa-undo"></i>
              </a>
            ) : (
              <a onClick={() => this.handleMouseClick("list")}>
                <i className="fas fa-list"></i>
              </a>
            )}
          </div>
          <div className="col panel-right">
            <a onClick={() => this.handleMouseClick("close")}>
              <i className="fas fa-caret-down"></i>
              <p> Notes</p>
            </a>
          </div>
        </div>

        <div className={this.state.mainAnimation}>
          {this.state.isVisible ? (
            <Fragment>
              {this.state.isShowingList ? (
                <Fragment>
                  <div className="notelist">
                    {this.state.noteList.map(({ _id, text }) => (
                      <div className="note row">
                        <div
                          className="note-text col-md-10"
                          onClick={() => this.handleNoteChange(_id)}
                        >
                          {text}
                        </div>
                        <div className="note-trash col-md-2">
                          <a onClick={() => this.deleteNote(_id)}>
                            <i className="fas fa-trash"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <form onSubmit={this.handleSubmit}>
                    <textarea
                      className="bigText"
                      value={this.state.currentNote}
                      onChange={this.handleChange}
                      name="note"
                      cols="40"
                      rows="10"
                    ></textarea>
                  </form>
                </Fragment>
              )}
            </Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Notes;
