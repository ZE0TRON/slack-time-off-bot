const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  name: String,
  max_day: Number
});

// Gets all policies from database
policySchema.statics.getPolicies = function() {
  return new Promise((resolve, reject) => {
    Policy.find({}, (err, policies) => {
      if (err) {
        reject(err);
      }
      if (policies.length == 0) {
        reject("There is no policy to delete");
      }
      resolve(policies);
    });
  });
};

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
