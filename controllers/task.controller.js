const User = require("../models/auth.model");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
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

exports.getTasks = (req, res) => {
  const token = req.params.token;
  projectID = req.params.projectID;

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

        Project.findById(projectID).exec((err, project) => {
          if (err || !project) {
            return res.status(400).json({
              error: "Project not found",
            });
          }

          if (_id === project.user._id.toString()) {
            Task.find({ project: projectID }, (err, tasks) => {
              if (err) {
                return res.status(401).json({
                  errors: "Tasks not found",
                });
              }

              res.json(tasks);
            });
          } else {
            return res.status(400).json({
              error: "Unauthorized",
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.createTask = (req, res) => {
  const { token, projectID, name } = req.body;
  console.log(req.body);

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

            if (_id === project.user._id.toString()) {
              const task = new Task({
                project: projectID,
                name: name,
              });

              task.save((err, task) => {
                if (err) {
                  console.log("Save error", errorHandler(err));
                  return res.status(401).json({
                    errors: errorHandler(err),
                  });
                }
                res.json({ task });
              });
            } else {
              return res.status(400).json({
                error: "Unauthorized",
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

exports.editTask = (req, res) => {
  const { token, name, isDone } = req.body;
  const taskID = req.params.id;

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

          Task.findById(taskID).exec((err, task) => {
            if (err || !task) {
              return res.status(400).json({
                error: "Task not found",
              });
            }

            Project.findById(task.project).exec((err, project) => {
              if (err || !project) {
                return res.status(400).json({
                  error: "Project not found",
                });
              }

              if (_id === project.user.toString()) {
                task.name = name;
                task.isDone = isDone;

                console.log("Name", name);
                console.log("Task - ", task);

                task.save((err, task) => {
                  if (err) {
                    console.log("Save error", errorHandler(err));
                    return res.status(401).json({
                      errors: errorHandler(err),
                    });
                  }

                  res.json({ task });
                });
              } else {
                return res.status(400).json({
                  error: "Unauthorized",
                });
              }
            });
          });
        });
      }
    });
  } else {
    return res.status(401).json({
      errors: "Token not found",
    });
  }
};

exports.deleteTask = (req, res) => {
  const token = req.params.token;
  const taskID = req.params.id;

  console.log("Token", token);
  console.log("TaskID", taskID);

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

          Task.findById(taskID).exec((err, task) => {
            if (err || !task) {
              return res.status(400).json({
                error: "Task not found",
              });
            }

            Project.findById(task.project).exec((err, project) => {
              if (err || !project) {
                return res.status(400).json({
                  error: "Project not found",
                });
              }

              if (_id === project.user.toString()) {
                task.remove((err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "Error deleting task",
                    });
                  }
                  res.json({
                    message: `Task Deleted`,
                  });
                });
              } else {
                return res.status(400).json({
                  error: "Unauthorized",
                });
              }
            });
          });
        });
      }
    });
  } else {
    return res.status(401).json({
      errors: "Token not found",
    });
  }
};
