const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  name: String,
  max_day: Number
});

const Policy = mongoose.model("Policy", policySchema);

// Gets all policies from database
Policy.prototype.getPolicies = function() {
  console.log("Debug get Policies model");
  return new Promise((resolve, reject) => {
    Policy.find({}, (err, policies) => {
      console.log("Debug get Policies model find");
      if (err) {
        reject(err);
      }
      resolve(policies);
    });
  });
};
module.exports = Policy;
