const policyController = require("./policy");
const timeOffController = require("./timeOff");
const request = require("request");

exports.handleCommand = (req, res, next) => {
  let text = req.body.text;
  let command = text.split(" ")[0];
  let responseUrl = req.body.response_url;
  let trigger_id = req.body.trigger_id;
  switch (command) {
    case "create_policy":
      policyController.createPolicy();
      break;
    case "delete_policy":
      policyController.deletePolicy();
      break;
    case "request":
      timeOffController.requestTimeOff();
      break;
    case "cancel":
      timeOffController.cancelTimeOff();
      break;
    default:
      return res.send("Invalid Command");
  }
  console.log(req.body);
  request.post(
    "https://slack.com/api/views.open",
    {
      json: {
        trigger_id:trigger_id,
        view:{
        type: "modal",
        callback_id: "modal-identifier",
        title: {
          type: "plain_text",
          text: "Just a modal"
        },
        blocks: [
          {
            type: "section",
            block_id: "section-identifier",
            text: {
              type: "mrkdwn",
              text: "*Welcome* to ~my~ Block Kit _modal_!"
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Just a button"
              },
              action_id: "button-identifier"
            }
          }
        ]
      }
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
};
