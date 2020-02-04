const TimeOff = require("../model/timeOff");
const request = require("request");
const build_kit = require("./build-kit");
// Deletes outdated time offs and send the active ones
exports.sendTimeOffAnnouncement = () => {
  TimeOff.getTimeOffs()
    .then(timeOffs => {
      const gonnaDelete = [];
      for (let i = 0; i < timeOffs.length; i++) {
        const dateParts = timeOffs[i].date.split("-");
        const newDateString =
          dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
        const newDate = new Date(newDateString);
        newDate.setDate(newDate.getDate() + 1);
        const today = new Date();
        if (newDate < today) {
          gonnaDelete.push(timeOffs[i]);
          timeOffs.splice(i, 1);
        }
      }
      const channelName = "timeoff";
      timeOffList = build_kit.createTimeOffList(timeOffs);
      console.log("Sending the list");
      request.post(
        "https://slack.com/api/chat.postMessage",
        {
          headers: {
            Authorization: "Bearer " + process.env.TOKEN
          },
          json: {
            channel: channelName,
            blocks: timeOffList.blocks
          }
        },
        (error, res, body) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log(body);
          console.log(res);
        }
      );
    })
    .catch();
};
