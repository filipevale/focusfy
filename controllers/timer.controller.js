const User = require("../models/auth.model");
const Timer = require("../models/timer.model");
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

exports.getTimers = (req, res) => {
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

        Timer.find({ user: _id }, (err, projects) => {
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

exports.createTimer = (req, res) => {
  const { token, minutes } = req.body;

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

          const timer = new Timer({
            user: _id,
            minutes: minutes,
          });

          timer.save((err, timer) => {
            if (err) {
              console.log("Save error", errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err),
              });
            }

            res.json({
              timer,
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
