const axios = require("axios");

exports.getIPAddress = () => {
  return axios
    .get("https://api.ipify.org")
    .then((response) => {
      const ip = response.data;
      return ip;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};
