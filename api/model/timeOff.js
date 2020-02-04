const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema({
  user_name: String,
  user_id: String,
  policy_name: String,
  date: String
});

// Gets all timeOffs of the user  from database
timeOffSchema.statics.getTimeOffsByUser = function(userName) {
  return new Promise((resolve, reject) => {
    TimeOff.find({ user_name: userName }, (err, timeOffs) => {
      if (err) {
        reject(err);
      }
      if (timeOffs.length == 0) {
        reject("You have no time off request");
      }
      resolve(timeOffs);
    });
  });
};

timeOffSchema.statics.getTimeOffs = function() {
  return new Promise((resolve, reject) => {
    TimeOff.find({}, (err, timeOffs) => {
      if (err) {
        reject(err);
      }
      if (timeOffs.length == 0) {
        reject("There is no timeOff request");
      }
      resolve(timeOffs);
    });
  });
};

const TimeOff = mongoose.model("TimeOff", timeOffSchema);
module.exports = TimeOff;
