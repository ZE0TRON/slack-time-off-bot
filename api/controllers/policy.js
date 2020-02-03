const createPolicyTemplate = require("../../build_kit_templates/createPolicy.json");
const deletePolicyTemplate = require("../../build_kit_templates/deletePolicy.json");
const build_kit = require("../util/build-kit.js");
const request = require("request");
const Policy = require("../model/policy");
// Sends Policy Modal as a response
exports.sendPolicyModal = trigger_id => {
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
    }
  );
};

// Creates a policy with given parameters
exports.createPolicy = (userName, policyName, maxDays) => {
  return new Promise((resolve, reject) => {
    Policy.findOne({ name: policyName }, (err, policy) => {
      if (policy != null) {
        reject({
          msg: "This policy already exists",
          block: "policy_name"
        });
      }
      const newPolicy = new Policy();
      newPolicy.name = policyName;
      newPolicy.max_day = maxDays;
      newPolicy.save(err => {
        if (err) {
          reject({
            msg: err,
            block: "policy_name"
          });
        }
        resolve(true);
      });
    });
  });
};

// Send a list of policies to select them for delete
exports.sendDeletePolicySelector = (responseUrl, userName) => {
  // TODO: add options to deletePolicyUpdate
  return new Promise((resolve, reject) => {
    build_kit
      .addPoliciesToMultiSelect(deletePolicyTemplate, false)
      .then(template => {
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
              reject(err);
            }
            resolve(true);
          }
        );
      })
      .catch(err => {
        reject(err);
      });
  });
};

// Deletes the policy
exports.deletePolicy = (userName, policyName) => {
  return new Promise((resolve, reject) => {
    Policy.deleteOne({ name: policyName }, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};
