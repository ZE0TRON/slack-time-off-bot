const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const routes = require("./api/routes");

// Load the dotenv config from .env.dev
dotenv.config({ path: ".env.dev" });

// Create a express app
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", routes);
http.createServer(app).listen(port);
console.log("Server started on: " + port);
