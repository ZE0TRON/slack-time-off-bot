const policyController = require("./policy");
const timeOffController = require("./timeOff");
exports.handleCommand = (req,res,next) => {
  let text = req.body.text;
  let command = text.split(" ")[1];
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
      res.send("Invalid Command");
  }
  console.log(req.body);
};
