const logger = require("../utils/logger");
const { getIPAddress } = require("../services/getIPAddress");

const logDataFn = {
  logLoginData: (req, res, next) => {
    getIPAddress()
      .then((ip) => {
        logger.info({
          userAgent: req.useragent.source,
          method: req.method,
          route: req.originalUrl,
          email: req.body.email,
          ip: ip,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return next();
  },
  logData: (req, res, next) => {
    getIPAddress()
      .then((ip) => {
        logger.info({
          userAgent: req.useragent.source,
          method: req.method,
          route: req.originalUrl,
          ip: ip,
          userId: req.body.userId,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return next();
  },
};

module.exports = logDataFn;
