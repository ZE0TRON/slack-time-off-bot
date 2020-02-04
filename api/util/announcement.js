const TimeOff = require("../model/timeOff");
const request = require("request");

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
      const channelName = "";
      
      request.post(
        "https://slack.com/api/chat.postMessage",
        {
          headers: {
            Authorization: "Bearer " + process.env.TOKEN
          },
          json: {
            channel: trigger_id,
            text: ""
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
    .catch();
};
