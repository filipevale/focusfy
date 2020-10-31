const User = require("../models/auth.model");
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

exports.getProjects = (req, res) => {
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

        Project.find({ user: _id }, (err, projects) => {
          if (err) {
            return res.status(401).json({
              errors: "Projects not found",
            });
          }

          res.json(projects);
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.createProject = (req, res) => {
  const { token, name } = req.body;

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

          const project = new Project({
            user: _id,
            name: name,
          });

          project.save((err, project) => {
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
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.editProject = (req, res) => {
  const { token, name } = req.body;
  const projectID = req.params.id;

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
              project.name = name;
              project.save((err, project) => {
                if (err) {
                  console.log("Save error", errorHandler(err));
                  return res.status(401).json({
                    errors: errorHandler(err),
                  });
                }

                res.json({ project });
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
    return res.status(401).json({
      errors: "Token not found",
    });
  }
};

exports.deleteProject = (req, res) => {
  const token = req.params.token;
  const projectID = req.params.id;

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
              project.remove((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error deleting project",
                  });
                }
                res.json({
                  message: `Project Deleted`,
                });
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
    return res.status(401).json({
      errors: "Token not found",
    });
  }
};
