const createPolicyTemplate = require("../../build_kit_templates/createPolicy.json");
const request = require("request");

exports.createPolicy = (trigger_id,userName) => {
    console.log("Create Policy");
    request.post(
      "https://slack.com/api/views.open",
      {
        headers: {
          Authorization: "Bearer " + process.env.TOKEN
        },
        json: {
          trigger_id: trigger_id,
          view: createPolicyTemplate
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
exports.deletePolicy = () => {
    console.log("Delete Policy");
};

