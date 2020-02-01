const requestTimeOffTemplate = require("../../build_kit_templates/requestTimeOff.json");
const build_kit = require("../util/build-kit.js");
const request = require("request");
const policyController = require("./policy");

exports.sendTimeOffModal = trigger_id => {
build_kit.addPoliciesToMultiSelect(requestTimeOffTemplate,true).then(template=> {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  template = build_kit.changeInitialDate(template,1,date);
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
}).catch(err => {});
};


exports.createTimeOff = () => {

    console.log("Request TimeOff");

};
exports.cancelTimeOff = () => {
    console.log("Cancel TimeOff");
};
