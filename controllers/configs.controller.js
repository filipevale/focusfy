const User = require("../models/auth.model");
const Note = require("../models/note.model");
const Project = require("../models/project.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandling");
const sgMail = require("@sendgrid/mail");
const { post } = require("../routes/auth.route");
const { json } = require("body-parser");
sgMail.setApiKey(process.env.MAIL_KEY);

exports.getCurrentTaskProject = (req, res) => {
  const token = req.params.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          Project.findById(user.configs.currentTaskProject).exec(
            (err, project) => {
              if (err) {
                return res.status(400).json({
                  error: "Project not found",
                });
              }

              return res.json({
                project,
              });
            }
          );
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.editCurrentTaskProject = (req, res) => {
  const { token, projectID } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          Project.findById(projectID).exec((err, project) => {
            if (err || !project) {
              return res.status(400).json({
                error: "Project not found",
              });
            }
            if (project.user.toString() === user._id.toString()) {
              user.configs.currentTaskProject = project;
              user.save((err, user) => {
                if (err) {
                  console.log("Save error", errorHandler(err));
                  return res.status(401).json({
                    errors: errorHandler(err),
                  });
                }

                res.json({
                  project,
                });
              });
            }
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.getTimerConfigs = (req, res) => {
  const token = req.params.token;

  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          const breakTime = user.configs.breakTime;
          const sessionTime = user.configs.sessionTime;

          return res.json({
            breakTime,
            sessionTime,
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.editTimer = (req, res) => {
  const { token, breakTime, sessionTime } = req.body;
  console.log(token);
  console.log(breakTime);
  console.log(sessionTime);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          user.configs.breakTime = breakTime;
          user.configs.sessionTime = sessionTime;

          user.save((err, user) => {
            if (err) {
              console.log("Save error", errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err),
              });
            }

            res.json({
              breakTime,
              sessionTime,
            });
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.getCurrentNote = (req, res) => {
  console.log("HEY");
  const token = req.params.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          Note.findById(user.configs.currentNote).exec((err, note) => {
            if (err) {
              return res.status(400).json({
                error: "Note not found",
              });
            }

            return res.json({
              note,
            });
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.editCurrentNote = (req, res) => {
  const { token, noteID } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          errors: "Token not valid",
        });
      } else {
        const { _id } = jwt.decode(token);

        if (!_id) {
          return res.status(401).json({
            errors: "Invalid Id",
          });
        }

        User.findById(_id).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "User not found",
            });
          }

          Note.findById(noteID).exec((err, note) => {
            if (err || !note) {
              return res.status(400).json({
                error: "Note not found",
              });
            }

            if (note.user.toString() === user._id.toString()) {
              user.configs.currentNote = note;
              user.save((err, user) => {
                if (err) {
                  console.log("Save error", errorHandler(err));
                  return res.status(401).json({
                    errors: errorHandler(err),
                  });
                }

                res.json({
                  note,
                });
              });
            }
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};
