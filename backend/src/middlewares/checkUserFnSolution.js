const config = require("../config/config");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { getIPAddress } = require("../services/getIPAddress");

module.exports.checkForValidUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // check if authorization header is null, undefined or does not contain Bearer
  if (
    authHeader === null ||
    authHeader === undefined ||
    !authHeader.startsWith("Bearer ")
  ) {
    console.log("req.headers.authorization is undefined");
    return res
      .status(403)
      .send({ message: "Unauthorised! You are not logged in as user." });
  } else {
    // Retrieve the authorization header and parse out the
    // JWT using the split function
    console.log("retrieving authorization header");
    let token = authHeader.split(" ")[1];

    jwt.verify(token, config.JWTKey, (err, data) => {
      console.log("data extracted from token \n", data);
      if (err) {
        console.log(err);
        return res.status(403).send({ message: "Unauthorised Access" });
      } else {
        req.body.userId = data.id;
        next();
      }
    });
  }
};

module.exports.checkValidAdminRole = (req, res, next) => {
  console.log("http header - admin ", req.headers["user"]);
  console.log("authHeader : " + req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  if (
    authHeader === null ||
    authHeader === undefined ||
    !authHeader.startsWith("Bearer ")
  ) {
    console.log(
      "authHeader is null or undefined or does not start with Bearer"
    );
    return res.status(403).send({ message: "Unauthorized access" });
  } else {
    //Retrieve authorization header and parse out the JWT using the split function
    console.log("Retrieving authorization header");
    let token = authHeader.split(" ")[1];
    console.log("Check for received token from frontend : \n");
    console.log(token);

    jwt.verify(token, config.JWTKey, (err, data) => {
      console.log("data extracted from token \n", data);
      if (err) {
        console.log(err);
        return res.status(403).send({ message: "Unauthorized access" });
      } else {
        console.log("data: " + data.role);
        if (data.role == "admin") {
          console.log("User is admin");
          req.body.userId = data.id;
          next();
        } else {
          console.log("User is not admin");
          return res.status(403).send({
            message: "Unauthorized access! You are not an admin.",
          });
        }
      }
    });
  }
}; //End of checkValidAdminRole

module.exports.retrieveUserRole = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (
    authHeader === null ||
    authHeader === undefined ||
    !authHeader.startsWith("Bearer ")
  ) {
    console.log(
      "authHeader is null or undefined or does not start with Bearer"
    );
    return res.status(403).send({ message: "Unauthorized access" });
  } else {
    console.log("Retrieving authorization header");
    let token = authHeader.split(" ")[1];
    // console.log("Check for received token from frontend : \n");
    // console.log(token);

    jwt.verify(token, config.JWTKey, (err, data) => {
      if (err) {
        getIPAddress()
          .then((ip) => {
            logger.error({
              userAgent: req.useragent.source,
              method: req.method,
              route: req.originalUrl,
              ip: ip,
              info: "Unauthorized Access Triggered",
              status: 403,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        return res.status(403).send({ message: "Unauthorized access" });
      } else {
        return res.status(200).send({ role: data.role });
      }
    });
  }
};
