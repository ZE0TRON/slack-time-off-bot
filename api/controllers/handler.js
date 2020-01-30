const policyController = require("./policy");
const timeOffController = require("./timeOff");
const request = require("request");


exports.handleCommand = (req,res,next) => {
  let text = req.body.text;
  let command = text.split(" ")[0];
  let responseUrl = req.body.response_url;
  switch(command) {
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
    responseUrl,
    {
      json: {
       
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "sl_input",
				"placeholder": {
					"type": "plain_text",
					"text": "Placeholder text for single-line input"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Label"
			},
			"hint": {
				"type": "plain_text",
				"text": "Hint text"
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "ml_input",
				"multiline": true,
				"placeholder": {
					"type": "plain_text",
					"text": "Placeholder text for multi-line input"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Label"
			},
			"hint": {
				"type": "plain_text",
				"text": "Hint text"
			}
		}
	]
},
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
