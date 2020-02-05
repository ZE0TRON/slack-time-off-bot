const dotenv = require("dotenv");
// Load the dotenv config from .env.dev
dotenv.config({ path: ".env.dev" });
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const bodyParser = require("body-parser");
const announcement = require("./api/util/announcement");
const routes = require("./api/routes");

const mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB);
// Create a express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", routes);
http.createServer(app).listen(port);
console.log("Server started on: " + port);

// Monday 8 am California Time
const timeOffAnnouncementsRule = new schedule.RecurrenceRule();
timeOffAnnouncementsRule.dayOfWeek = 1;
timeOffAnnouncementsRule.hour = 16;

schedule.scheduleJob(
  timeOffAnnouncementsRule,
  announcement.sendTimeOffAnnouncement
);

exports.db = db;
