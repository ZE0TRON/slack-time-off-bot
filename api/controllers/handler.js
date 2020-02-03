const policyController = require("./policy");
const timeOffController = require("./timeOff");

// TODO: trim the inputs

// Handles command received from slack api(user  slash commands).
// Parses commands and sends them to the appropriate functions.
exports.handleCommand = (req, res, next) => {
  // Parse the values from request
  const text = req.body.text;
  const command = text.split(" ")[0];
  const responseUrl = req.body.response_url;
  const trigger_id = req.body.trigger_id;
  const user_name = req.body.user_name;

  // Handle the command
  switch (command) {
    case "create_policy":
      policyController.sendPolicyModal(trigger_id);
      res.send();
      break;
    case "delete_policy":
      policyController
        .sendDeletePolicySelector(responseUrl, user_name)
        .then(_ => {
          res.send();
        })
        .catch(err => {
          console.log("Err");
          console.log(err);
        });
      
      break;
    case "request":
      timeOffController.sendTimeOffModal(trigger_id);
      res.send();
      break;
    case "cancel":
      timeOffController.sendCancelTimeOffMessage(res, user_name);
      // res.send();
      break;
    default:
      return res.send("Invalid Command");
  }
};
// Handles payloads received from slack api.
// Parses payloads and sends them to the appropriate functions.

// TODO: modulate this function
exports.handlePayload = (req, res, next) => {
  // Verify the token of the payload
  const verify_token = process.env.VERIFICATION_TOKEN;
  const payload = JSON.parse(req.body.payload);
  if (payload.token !== verify_token) {
    return res.send("Invalid Token");
  }

  const userName = payload.user.username;
  // If its a payload created with interacting with a slack view.
  if (payload.view != null) {
    const modalName = payload.view.title.text;
    // The interaction values are hold in state property.
    const state = payload.view.state;

    switch (modalName) {
      // If it's created from create policy command interaction
      case "Create Policy":
        // Parse values from state
        const policy_name = state.values.policy_name.sl_input.value;
        const max_days = parseInt(state.values.max_day.sl_input.value);

        policyController
          .createPolicy(userName, policy_name, max_days)
          .then(resolve => {
            return res.send();
          })
          .catch(err => {
            sendError(err, res);
          });
        break;
      // If it's created from create request command interaction
      case "Request Time Off":
        // Parse values from state
        const stateValues = payload.view.state.values;
        const date = stateValues.date_select.picked_date.selected_date;
        const policy =
          stateValues.policy_selector.policy_select.selected_option.value;

        timeOffController
          .createTimeOff(policy, date, userName)
          .then(_ => {
            return res.send();
          })
          .catch(err => {
            return sendError(err, res);
          });
        break;
      default:
        return res.send("Invalid Modal");
    }
  }
  // If its a payload created with interacting with a slack message.
  else {
    // Check whether payload has a valid structure.
    if (payload.actions != null) {
      // Parse the interactions
      for (let i = 0; i < payload.actions.length; i++) {
        const action = payload.actions[i];
        const actionName = action.block_id.split("/")[0];
        switch (actionName) {
          // TODO: fix broken promise here -> loop breaks it.
          case "delete_policy":
            const selected = action.selected_options.map(x => x.value);
            policyController
              .deletePolicy(userName, selected)
              .then(_ => {
                return res.send();
              })
              .catch(err => {});
            break;
          case "cancel_timeoff":
            // Parse date and policy
            const datePol = action.value.split("/");
            const date = datePol[0];
            const policyName = datePol[1];

            timeOffController
              .cancelTimeOff(date, policyName, userName)
              .then(_ => {
                return res.send("Time off deleted " + date);
              })
              .catch(err => {
                return sendError(err, res);
              });
            break;
        }
      }
    }
  }
};

/**
 * Sends an error to a block in slack modal.
 * @param  {{msg,block}} err -
 * @param  {Object} res
 * @return {null}
 */
const sendError = (err, res) => {
  console.log(err);
  const errors = {};
  errors[err.block] = err.msg;
  return res.send({
    response_action: "errors",
    errors: errors
  });
};
