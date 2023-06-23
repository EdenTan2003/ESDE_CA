const rateLimit = require("express-rate-limit");
const { getIPAddress } = require("../services/getIPAddress");
const logger = require("../utils/logger");

const rateLimitFn = {
  loginCountLimit: rateLimit({
    max: 5, //limit unique ip up to 5 max request per windowMs
    windowMs: 1000 * 60, // 1 min
    message: "Too many login attempts, please try again after 1 minute",
    handler: function (req, res) {
      let message = "Too many login attempts, please try again after 1 minute";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            email: req.body.email,
            ip: ip,
            error: message,
            status: 429,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(429).send({ message: message });
    },
  }),

  registerCountLimit: rateLimit({
    max: 5, //limit unique ip up to 5 max request per windowMs
    windowMs: 1000 * 60 * 60, // 1 hour
    message: "Too many register attempts, please try again after 1 minute",
    handler: function (req, res) {
      let message = "Too many register attempts, please try again after 1 hour";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            email: req.body.email,
            ip: ip,
            error: message,
            status: 429,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(429).send({ message: message });
    },
  }),

  designSubmissionCountLimit: rateLimit({
    max: 5, //limit unique ip up to 5 max request per windowMs
    windowMs: 1000 * 60, // 1 minute
    message:
      "Too many design submission attempts, please try again after 1 minute",
    handler: function (req, res) {
      let message =
        "Too many design submission attempts, please try again after 1 minute";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            userId: req.body.userId,
            ip: ip,
            error: message,
            status: 429,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(429).send({ message: message });
    },
  }),

  emailInvitationCountLimit: rateLimit({
    max: 5, //limit unique ip up to 5 max request per windowMs
    windowMs: 1000 * 60, // 1 minute
    message:
      "Too many email invitation attempts, please try again after 1 minute",
    handler: function (req, res) {
      let message =
        "Too many email invitation attempts, please try again after 1 minute";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            userId: req.body.userId,
            ip: ip,
            error: message,
            status: 429,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(429).send({ message: message });
    },
  }),
};

module.exports = rateLimitFn;
