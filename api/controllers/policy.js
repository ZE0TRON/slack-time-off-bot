const createPolicyTemplate = require("../../build_kit_templates/createPolicy.json");
const request = require("request");

exports.sendPolicyModal = (trigger_id) => {
    console.log("Send Policy Modal");
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

exports.createPolicy = (userName,policyName,maxDays) => {
  return new Promise((resolve,reject) => {
    if(policyName.length<3) {
      reject({msg:"Policy name should be at least 3 characters",block:"policy_name"});
    }
    console.log("Create Policy");
    console.log(userName);
    console.log(policyName);
    console.log(maxDays);
    resolve(1);
  });
    
};


exports.deletePolicy = () => {
    console.log("Delete Policy");
};

