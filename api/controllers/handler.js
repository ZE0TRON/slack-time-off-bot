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
        text: "We will process it."
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
