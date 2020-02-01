const createPolicyTemplate = require("../../build_kit_templates/createPolicy.json");
const deletePolicyTemplate = require("../../build_kit_templates/deletePolicy.json");
const build_kit = require("../util/build-kit.js");
const request = require("request");

exports.sendPolicyModal = trigger_id => {
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

exports.createPolicy = (userName, policyName, maxDays) => {
  return new Promise((resolve, reject) => {
    if (policyName.length < 3) {
      reject({
        msg: "Policy name should be at least 3 characters",
        block: "policy_name"
      });
    }
    console.log("Create Policy");
    console.log(userName);
    console.log(policyName);
    console.log(maxDays);
    resolve(1);
  });
};

exports.sendDeletePolicySelector = (responseUrl, userName) => {
  console.log("Delete Policy");
  // TODO: add options to deletePolicyUpdate
    build_kit.addPoliciesToMultiSelect(deletePolicyTemplate).then(template=> {
      
      request.post(
        responseUrl,
        {
          // headers: {
          //   Authorization: "Bearer " + process.env.TOKEN
          // },
          json: template
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
    })
    .catch(err => {});
};

exports.deletePolicy = (userName, selected) => {
  return new Promise((resolve, reject) => {
    resolve(1);
  });
};

exports.getPolicies = () => {
  return new Promise((resolve, reject) => {
    let policies = [
      { name: "pol1", max_day: "5" },
      { name: "pol2", max_day: "5" },
      { name: "pol3", max_day: "2" },
      { name: "pol4", max_day: "3" },
      { name: "pol5", max_day: "4" },
      { name: "pol6", max_day: "5" },
      { name: "pol7", max_day: "1" },
      { name: "pol8", max_day: "5" }
    ];
    resolve(policies);
  });
};
