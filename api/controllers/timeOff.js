const requestTimeOffTemplate = require("../../build_kit_templates/requestTimeOff.json");
const cancelTimeOffTemplate = require("../../build_kit_templates/cancelTimeOff.json");
const build_kit = require("../util/build-kit.js");
const request = require("request");
const policyController = require("./policy");

exports.sendTimeOffModal = trigger_id => {
  build_kit
    .addPoliciesToMultiSelect(requestTimeOffTemplate, true)
    .then(template => {
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      template = build_kit.changeInitialDate(template, 1, date);
      console.log("Request TimeOff");
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
          console.log(`statusCode: ${res.statusCode}`);
          console.log(body);
        }
      );
    })
    .catch(err => {});
};

exports.createTimeOff = (policy, date, user) => {
  console.log("Create TimeOff");
  return new Promise((resolve, reject) => {
    let dateParts = date.split("-");
    let newDateString = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
    console.log("new Date String : ", newDateString);
    let newDate = new Date(newDateString);
    newDate.setDate(newDate.getDate() + 1);
    let today = new Date();
    console.log(newDate.toDateString());
    console.log(today.toDateString());
    if (newDate < today) {
      console.log("Sending err");
      reject({
        msg: "Can't Request Time Off in The Past",
        block: "date_select"
      });
    }
    console.log("Create Policy");
    console.log(user);
    console.log(policy);
    console.log(date);
    resolve(1);
  });
};

exports.sendCancelTimeOffMessage = (res, userName) => {
  this.getTimeOffs(userName)
    .then(timeOffs => {
      cancelTimeOffTemplate.blocks = [];
      for (let i = 0; i < timeOffs.length; i++) {
        cancelTimeOffTemplate.blocks.push(
          build_kit.timeOffCancelButton(timeOffs[i].date, timeOffs[i].policy)
        );
      }
      return res.send(cancelTimeOffTemplate);
    })
    .catch(err => {});
};

exports.cancelTimeOff = () => {
  console.log("Cancel TimeOff");
};

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
