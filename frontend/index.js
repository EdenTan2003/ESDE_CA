const express = require("express");
const serveStatic = require("serve-static");
const https = require("https");
const fs = require("fs");

var port = 3001;

var app = express();

//Read private key and certificate for HTTPS ~ Sensitive Data Exposure Prevention
const credentials = {
  key: fs.readFileSync("./Certs/ESDE_CA1_key.pem"),
  cert: fs.readFileSync("./Certs/ESDE_CA1.pem"),
};
//End of Sensitive Data Exposure Prevention

app.use(function (req, res, next) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);
  // Checking the incoming request type from the client
  if (req.method != "GET") {
    res.type(".html");
    var msg =
      "<html><body>This server only serves web pages with GET request</body></html>";
    res.end(msg);
  } else {
    next();
  }
});

app.use(serveStatic(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("/public/home.html", { root: __dirname });
});

// app.listen(port, hostname, function () {
//   console.log(`Server hosted at http://${hostname}:${port}`);
// });

// Create an HTTPS server with the 'credentials' for a secure connection
const server = https.createServer(credentials, app);
server.listen(port, hostname, function () {
  console.log(`Server hosted at https://localhost:${port}`);
});
