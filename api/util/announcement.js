const TimeOff = require("../model/timeOff");
const request = require("request");
const build_kit = require("./build-kit");
// Deletes outdated time offs and send the active ones
exports.sendTimeOffAnnouncement = () => {
  TimeOff.getTimeOffs()
    .then(timeOffs => {
      const timeOffResults = filterTimeOffs(timeOffs);
      const thisWeekTimeOffs = timeOffResults.thisWeek;
      const expiredTimeOffs = timeOffResults.expired;
      const channelName = "timeoff";
      TimeOff.deleteTimeOffs(expiredTimeOffs)
        .then(_ => {
          timeOffList = build_kit.createTimeOffList(thisWeekTimeOffs);
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
            }
          );
        })
        .catch(err => {
          console.err(err);
        });
    })
    .catch(err => {
      console.err(err);
    });
};

const filterTimeOffs = timeOffs => {
  const expired = [];
  const thisWeek = [];
  for (let i = 0; i < timeOffs.length; i++) {
    const dateParts = timeOffs[i].date.split("-");
    const newDateString =
      dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
    const newDate = new Date(newDateString);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + ((1 + 7 - nextWeek.getDay()) % 7));
    if (newDate < today) {
      expired.push(timeOffs[i]);
    } else if (newDate <= nextWeek) {
      thisWeek.push(timeOffs[i]);
    }
  }
  return { expired: expired, thisWeek: thisWeek };
};
