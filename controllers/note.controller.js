const User = require("../models/auth.model");
const Note = require("../models/note.model");
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

exports.getNotes = (req, res) => {
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

        Note.find({ user: _id }, (err, notes) => {
          if (err) {
            return res.status(401).json({
              errors: "Projects not found",
            });
          }

          res.json(notes);
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.createNote = (req, res) => {
  const { token, text } = req.body;

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

          const note = new Note({
            user: _id,
            text: text,
          });

          note.save((err, note) => {
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
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Token not found",
    });
  }
};

exports.editNote = (req, res) => {
  const { token, text } = req.body;
  const noteID = req.params.id;

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
                error: "Project not found",
              });
            }

            if (_id === note.user._id.toString()) {
              note.text = text;
              note.save((err, note) => {
                if (err) {
                  console.log("Save error", errorHandler(err));
                  return res.status(401).json({
                    errors: errorHandler(err),
                  });
                }

                res.json({ note });
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

exports.deleteNote = (req, res) => {
  const token = req.params.token;
  const noteID = req.params.id;

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
                error: "Project not found",
              });
            }

            if (_id === note.user._id.toString()) {
              note.remove((err, result) => {
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
