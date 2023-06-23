var validator = require("validator");
var path = require("path");
var fs = require("fs");
var logger = require("../utils/logger");
const { getIPAddress } = require("../services/getIPAddress");

const validateFn = {
  validateRegister: function (req, res, next) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var password = req.body.password;

    // Username contains only alphabet, spaces, single quote or comma
    const ReFullName = new RegExp(`^[\\w\\s,']+$`);

    // Password contains at least 1 upper case, 1 lower case, 1 number, 1 special character and 7 or more characters
    const RePassword = new RegExp(
      `^(?=.*\\w)(?=.*\\d)(?=.*[!@#\\$%\\^&\\*]){7,}`
    );

    if (
      ReFullName.test(fullname) &&
      validator.isEmail(email) &&
      RePassword.test(password)
    ) {
      next();
    } else {
      let message =
        "Invalid input, Please enter a valid Fullname/Email/Password";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            name: req.body.fullname,
            email: req.body.email,
            ip: ip,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({
        message: message,
      });
    }
  },

  validateEmail: function (req, res, next) {
    var email = req.body.email;
    if (validator.isEmail(email)) {
      next();
    } else {
      let message = "Unable to Login, Please enter a valid Email";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            email: req.body.email,
            ip: ip,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({ message: message });
    }
  },

  validateDesignTitleAndDesc: function (req, res, next) {
    var title = req.body.designTitle;
    var description = req.body.designDescription;

    // Description contains only alphabet, spaces, digit, single quote
    const ReTitle = new RegExp(`^[\\w\\d\\s']+$`);
    // Description contains only alphabet, spaces, digit, single/double quote or comma
    const ReDescription = new RegExp(`^[\\w\\d\\s,'"]+$`);
    if (ReTitle.test(title) && ReDescription.test(description)) {
      next();
    } else {
      let message = "Unable to submit design, Title/Description is invalid.";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            ip: ip,
            userId: req.body.userId,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({
        message: message,
      });
    }
  },

  validateFileTypeAndSize: function (req, res, next) {
    var submittedFile = req.body.file;
    console.log("Validation for file type: " + submittedFile);

    var fileName = path.basename(submittedFile.path);
    console.log("Submitted file path: " + submittedFile.path);
    console.log("Path base name :" + path.basename(submittedFile.path));

    var fileExtension = fileName.split(".");
    fileExtension = fileExtension[fileExtension.length - 1];

    var validFileSize = false;

    //Get file size in bytes
    var fileStat = fs.statSync(submittedFile.path);
    var fileSizeInBytes = fileStat.size;
    console.log(`File size in bytes: ${fileSizeInBytes / 1000000}MB`);

    //Check file size
    if (fileSizeInBytes <= 1000000) {
      validFileSize = true;
    } else {
      console.log("File size exceeded 1MB");
    }

    var validFileType = false;

    switch (fileExtension.toLowerCase()) {
      case "jpg":
        validFileType = true;
        break;
      case "jpeg":
        validFileType = true;
        break;
      case "png":
        validFileType = true;
        break;
      case "gif":
        validFileType = true;
        break;
    }

    if (validFileSize == false || validFileType == false) {
      console.log("Invalid file type/size received");
      fs.unlink(submittedFile.path, function (err) {
        if (err) return console.log(err);
        console.log("Deleted file successfully");
      });

      if (!validFileSize) {
        let message = "Invalid file size. File size must be less than 1MB.";
        getIPAddress()
          .then((ip) => {
            logger.error({
              userAgent: req.useragent.source,
              method: req.method,
              route: req.originalUrl,
              ip: ip,
              userId: req.body.userId,
              error: message,
              status: 400,
            });
          })
          .catch((error) => {
            console.log(error);
          });

        return res.status(400).send({ message: message });
      } else if (!validFileType) {
        let message = "Invalid file type. Only jpg/jpeg/png/gif are allowed.";
        getIPAddress()
          .then((ip) => {
            logger.error({
              userAgent: req.useragent.source,
              method: req.method,
              route: req.originalUrl,
              ip: ip,
              userId: req.body.userId,
              error: message,
              status: 400,
            });
          })
          .catch((error) => {
            console.log(error);
          });

        return res.status(400).send({ message: message });
      }
    } else {
      console.log("Validation Passed");
      next();
    }
  },

  validateSearchUserSubByEmail: function (req, res, next) {
    var search = req.params.search;

    if (validator.isEmail(search)) {
      next();
    } else {
      let message = "Invalid Search";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            ip: ip,
            userId: req.body.userId,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({ message: message });
    }
  },

  validateUserSearchOwnSubmission: function (req, res, next) {
    var subSearch = req.params.search;

    const ReSubSearch = new RegExp(`^[\\w\\d\\s']+$`);

    if (ReSubSearch.test(subSearch)) {
      next();
    } else {
      let message = "Invalid Search";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            httpVersion: req.httpVersion,
            route: req.originalUrl,
            ip: ip,
            userId: req.body.userId,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({ message: message });
    }
  },

  validateSearchUserByName: function (req, res, next) {
    var search = req.params.search;

    const ReSearch = new RegExp(`^[\\w\\s']+$`);

    if (ReSearch.test(search)) {
      next();
    } else {
      let message = "Invalid Search";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            ip: ip,
            userId: req.body.userId,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({ message: message });
    }
  },

  validateEmailRecipient: function (req, res, next) {
    var email = req.body.recipientEmail;
    var name = req.body.recipientName;

    // username contains only alphabet, spaces, single quote or comma
    const ReName = new RegExp(`^[\\w\\s,']+$`);

    if (validator.isEmail(email) && ReName.test(name)) {
      next();
    } else {
      let message = "Unable to complete operation, email/name is invalid";
      getIPAddress()
        .then((ip) => {
          logger.error({
            userAgent: req.useragent.source,
            method: req.method,
            route: req.originalUrl,
            ip: ip,
            userId: req.body.userId,
            error: message,
            status: 400,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(400).send({ message: message });
    }
  },

  sanitizeResult: function (result) {
    if (result.filedata) {
      for (file of result.filedata) {
        file.design_title = validator.escape(file.design_title);
        file.design_description = validator.escape(file.design_description);
      }
    } else if (result.userdata) {
      if (result.userdata.length >= 1) {
        for (user of result.userdata) {
          user.fullname = validator.escape(user.fullname);
          user.email = validator.escape(user.email);
          user.role_name = validator.escape(user.role_name);
        }
      }
    }
    return result;
  }, // end sanitizeResult
};

module.exports = validateFn;
