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
  console.log(process.env.TOKEN);
  request.post(
    "https://slack.com/api/views.open",
    {
      headers: {
        Authorization: "Bearer " + process.env.TOKEN
      },
      json: {
        trigger_id: trigger_id,
        view: {
          type: "modal",
          title: {
            type: "plain_text",
            text: "Create Policy",
            emoji: true
          },
          submit: {
            type: "plain_text",
            text: "Create",
            emoji: true
          },
          close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true
          },
          blocks: [
            {
              type: "input",
              element: {
                type: "plain_text_input",
                action_id: "sl_input",
                placeholder: {
                  type: "plain_text",
                  text: "Enter policy name"
                }
              },
              label: {
                type: "plain_text",
                text: "Policy Name"
              },
              hint: {
                type: "plain_text",
                text: "Name of Your Time Off Policy"
              }
            },
            {
              type: "input",
              element: {
                type: "plain_text_input",
                action_id: "ml_input",
                placeholder: {
                  type: "plain_text",
                  text: "Enter maximum days"
                }
              },
              label: {
                type: "plain_text",
                text: "Max Day"
              },
              hint: {
                type: "plain_text",
                text: "Enter maximum days allowed in the policy"
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
