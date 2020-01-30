const policyController = require("./policy");
const timeOffController = require("./timeOff");
exports.handleCommand = (req, res, next) => {
  let text = req.body.text;
  let command = text.split(" ")[0];
  let responseUrl = req.body.response_url;
  let trigger_id = req.body.trigger_id;
  let user_name = req.body.user_name;
  switch (command) {
    case "create_policy":
      policyController.createPolicy(trigger_id,user_name);
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
  
};

exports.handlePayload = (req, res, next) => {

  console.log("handle Payload");
  let payload = JSON.parse(req.body.payload);
  console.log(payload);

}