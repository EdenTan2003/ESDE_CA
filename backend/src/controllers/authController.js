const user = require("../services/userService");
const auth = require("../services/authService");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { getIPAddress } = require("../services/getIPAddress");

exports.processLogin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    var results = await auth.authenticate(email);
    if (results.length == 1) {
      if (password == null || results[0] == null) {
        throw "Login has failed.";
      }
      if (!bcrypt.compareSync(password, results[0].user_password) == true) {
        getIPAddress()
          .then((ip) => {
            logger.error({
              userAgent: req.useragent.source,
              method: req.method,
              route: req.originalUrl,
              email: req.body.email,
              ip: ip,
              error: "Password does not match",
              status: 401,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        throw "Invalid login credentials. Please try again.";
      } else {
        let data = {
          user_id: results[0].user_id,
          role_name: results[0].role_name,
          token: jwt.sign(
            { id: results[0].user_id, role: results[0].role_name },
            config.JWTKey,
            {
              expiresIn: 86400, //Expires in 24 hrs
            }
          ),
        }; //End of data variable setup
        return res.status(200).json(data);
      }
    }
  } catch (error) {
    if (error == "Invalid login credentials. Please try again.") {
      let message = "Invalid login credentials. Please try again.";
      return res.status(500).json({ message: message });
    } else {
      console.log(error);
      let message = "Login has failed.";
      return res.status(500).json({
        error: error,
        message: message,
      });
    }
  }
}; //End of processLogin

// exports.processLogin = (req, res, next) => {
//   let email = req.body.email;
//   let password = req.body.password;
//   try {
//     auth.authenticate(email, function (error, results) {
//       if (error) {
//         // let message = "Credentials are not valid.";
//         //return res.status(500).json({ message: message });
//         //If the following statement replaces the above statement
//         //to return a JSON response to the client, the SQLMap or
//         //any attacker (who relies on the error) will be very happy
//         //because they relies a lot on SQL error for designing how to do
//         //attack and anticipate how much "rewards" after the effort.
//         //Rewards such as sabotage (seriously damage the data in database),
//         //data theft (grab and sell).
//         return res.status(500).json({ message: error });
//       } else {
//         if (results.length == 1) {
//           if (password == null || results[0] == null) {
//             return res.status(500).json({ message: "login failed" });
//           }
//           if (bcrypt.compareSync(password, results[0].user_password) == true) {
//             let data = {
//               user_id: results[0].user_id,
//               role_name: results[0].role_name,
//               token: jwt.sign(
//                 { id: results[0].user_id, role: results[0].role_name },
//                 config.JWTKey,
//                 {
//                   expiresIn: 86400, //Expires in 24 hrs
//                 }
//               ),
//             }; //End of data variable setup

//             return res.status(200).json(data);
//           } else {
//             getIPAddress()
//               .then((ip) => {
//                 logger.error({
//                   userAgent: req.useragent.source,
//                   method: req.method,
//                   route: req.originalUrl,
//                   email: req.body.email,
//                   ip: ip,
//                   error: "Password does not match",
//                   status: 401,
//                 });
//               })
//               .catch((error) => {
//                 console.log(error);
//               });
//             return res.status(500).json({ message: error });
//           } //End of passowrd comparison with the retrieved decoded password.
//         } //End of checking if there are returned SQL results
//       }
//     });
//   } catch (error) {
//     getIPAddress()
//       .then((ip) => {
//         logger.error({
//           method: req.method,
//           route: req.originalUrl,
//           email: req.body.email,
//           ip: ip,
//           error: error,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     return res.status(500).json({ message: error });
//   } //end of try
// };

exports.processRegister = (req, res, next) => {
  console.log("processRegister running.");
  let fullName = req.body.fullName;
  let email = req.body.email;
  let password = req.body.password;

  bcrypt.hash(password, 10, async (error, hash) => {
    try {
      if (error) {
        console.log("Error on hashing password");
        throw "Error on hashing password.";
      } else {
        var results = await user.createUser(fullName, email, hash);
        if (results != null) {
          console.log(results);
          let message = "Completed registration.";
          return res.status(200).json({ message: message });
        }
      }
    } catch (error) {
      console.log(error);
      if (error.errno == 1062) {
        let message = "Email already exists.";
        return res.status(500).json({ message: message });
      } else {
        let message = "Unable to complete registration.";
        return res.status(500).json({
          error: error,
          message: message,
        });
      }
    }
  });
}; //End of processRegister
