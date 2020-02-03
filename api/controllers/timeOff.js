const requestTimeOffTemplate = require("../../build_kit_templates/requestTimeOff.json");
const cancelTimeOffTemplate = require("../../build_kit_templates/cancelTimeOff.json");
const build_kit = require("../util/build-kit.js");
const request = require("request");

// Sends a time off selection modal as a response
exports.sendTimeOffModal = trigger_id => {
  build_kit
    .addPoliciesToMultiSelect(requestTimeOffTemplate, true)
    .then(template => {
      // Getting to days date in the format of slack's date picker
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      // Change the initial date of the date picker to today.
      template = build_kit.changeInitialDate(template, 1, date);
      request.post(
        "https://slack.com/api/views.open",
        {
          headers: {
            Authorization: "Bearer " + process.env.TOKEN
          },
          json: {
            trigger_id: trigger_id,
            view: template
          }
        },
        (error, res, body) => {
          if (error) {
            console.error(error);
            return;
          }
        }
      );
    })
    .catch(err => {});
};
// Creates a time off and saves it to database
exports.createTimeOff = (policy, date, user) => {
  return new Promise((resolve, reject) => {
    const dateParts = date.split("-");
    const newDateString =
      dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
    const newDate = new Date(newDateString);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    if (newDate < today) {
      reject({
        msg: "Can't Request Time Off in The Past",
        block: "date_select"
      });
    }
    resolve(1);
  });
};

// Sends a list of time offs with a cancel button as a response
exports.sendCancelTimeOffMessage = (res, userName) => {
  // TODO: add update response
  this.getTimeOffs(userName)
    .then(timeOffs => {
      cancelTimeOffTemplate.blocks = [];
      for (let i = 0; i < timeOffs.length; i++) {
        cancelTimeOffTemplate.blocks.push(
          build_kit.timeOffCancelButton(timeOffs[i].date, timeOffs[i].policy, i)
        );
      }
      return res.send(cancelTimeOffTemplate);
    })
    .catch(err => {});
};

// Deletes a time off
exports.cancelTimeOff = (date, policy, userName) => {
  return new Promise((resolve, reject) => {
    console.log(date, policy, userName);
    resolve(1);
  });
};

// Gets the current time offs of a user
exports.getTimeOffs = userName => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        date: "24-02-2020",
        policy: { name: "Policy1", max_day: "2" }
      },
      { date: "12-03-2020", policy: { name: "Policy5", max_day: "20" } }
    ]);
  });
};
