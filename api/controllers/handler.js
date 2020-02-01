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
      res.send();
      break;
    case "delete_policy":
      policyController.sendDeletePolicySelector(responseUrl, user_name);
      res.send();
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

  let userName = payload.user.username;

  if (payload.view != null) {
    let modalName = payload.view.title.text;
    let state = payload.view.state;
    switch (modalName) {
      case "Create Policy":
        let policy_name = state.values.policy_name.sl_input.value;
        let max_days = parseInt(state.values.max_day.sl_input.value);

        policyController
          .createPolicy(userName, policy_name, max_days)
          .then(resolve => {
            return res.send({text:"Policy Created"});
          })
          .catch(err => {
            sendError(err, res);
          });
        break;

      default:
        res.send("Invalid Modal");
    }
  } else {
    if (payload.actions != null) {
      for (let i = 0; i < payload.actions.length; i++) {
        let action = payload.actions[i];
        let actionName = action.block_id;
        switch (actionName) {
          case "delete_policy":
            let selected = action.selected_options.map(x => x.value);
            policyController
              .deletePolicy(userName, selected)
              .then(_ => {
                return res.send();
              })
              .catch(err => {});
            console.log(selected);
            break;
        }
      }
    }
  }
};

let sendError = (err, res) => {
  console.log(err.msg);
  let errors = {};
  errors[err.block] = err.msg;
  return res.send({
    response_action: "errors",
    errors: errors
  });
};
