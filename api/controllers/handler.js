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
      policyController.sendPolicyModal(trigger_id);
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
  const verify_token = process.env.VERIFICATION_TOKEN;
  let payload = JSON.parse(req.body.payload);

  console.log(payload);

  if (payload.token !== verify_token) {
    return res.send("Invalid Token");
  }
  let state = payload.view.state;
  let userName = payload.user.username;
  let modalName = payload.view.title.text;
  switch(modalName) {
    case "Create Policy":
      let policy_name = state.values.policy_name.sl_input.value;
      let max_days = parseInt(state.values.max_days.sl_input.value);
      policyController.createPolicy(userName,policy_name,max_days);
      break;
    default:
      res.send("Invalid Modal");
  }

}