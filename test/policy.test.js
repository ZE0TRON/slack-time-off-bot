const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Policy = require("../api/model/policy");
const PolicyController = require("../api/controllers/policy");
const policies = require("./data/data").policies;
describe("Policy", () => {
  let db;
  beforeAll(async () => {
    dotenv.config({ path: ".env.test" });
    const mongoDB = process.env.MONGO_URL;
    await mongoose.connect(mongoDB);
    db = mongoose.connection;
  });

  afterAll(async () => {
    await db.close();
  });

  it("Should Get Policies", async () => {
    const dbPolicies = await Policy.getPolicies();
    expect(dbPolicies).toHaveLength(policies.length);
    for (let i = 0; i < dbPolicies.length; i++) {
      expect(dbPolicies[i].name).toBe(policies[i].name);
      expect(dbPolicies[i].max_day).toBe(policies[i].max_day);
    }
  });

  it("Should Delete Policy", async () => {
    await PolicyController.deletePolicy(policies[3].name);
    try {
      await PolicyController.deletePolicy(policies[3].name);
    } catch (e) {
      expect(e).toBeTruthy();
    }
    const dbPolicies = await Policy.getPolicies();
    expect(dbPolicies[3].name).not.toBe(policies[3].name);
  });

  it("Should Create a Policy", async () => {
    const policyName = "polTest";
    const policyMaxDay = 12;
    await PolicyController.createPolicy(policyName, policyMaxDay);
    const dbPolicies = await Policy.getPolicies();
    expect(dbPolicies[4].name).toBe(policyName);
    try {
      await PolicyController.createPolicy("polTest2", "policyMaxDay");
    } catch (e) {
      expect(e.msg).toBe("Max day should be a number");
    }
    try {
      await PolicyController.createPolicy(policyName, policyMaxDay + 1);
    } catch (e) {
      expect(e.msg).toBe("This policy already exists");
    }
  });
});
