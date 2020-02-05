const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Policy = require("../api/model/policy");
const TimeOff = require("../api/model/timeOff");

const policies = [
  new Policy({ name: "pol1", max_day: 5 }),
  new Policy({ name: "pol2", max_day: 2 }),
  new Policy({ name: "pol3", max_day: 3 }),
  new Policy({ name: "pol4", max_day: 4 }),
  new Policy({ name: "pol5", max_day: 100 })
];

const users = [
  { user_id: "U134123", user_name: "user1" },
  { user_id: "U234234", user_name: "user2" },
  { user_id: "U343566", user_name: "user3" }
];

const timeOffs = [
  // In the future
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[0].user_name,
    user_id: users[0].user_id,
    date: "2020-02-20"
  }),
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[1].user_name,
    user_id: users[1].user_id,
    date: "2020-02-20"
  }),
  new TimeOff({
    policy_name: policies[1].name,
    user_name: users[1].user_name,
    user_id: users[1].user_id,
    date: "2020-02-20"
  }),
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: "2020-03-21"
  }),
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[0].user_name,
    user_id: users[0].user_id,
    date: "2021-04-20"
  }),
  // In this week
  // TODO: automate this to this week
  new TimeOff({
    policy_name: policies[4].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: "2021-02-7"
  }),
  new TimeOff({
    policy_name: policies[2].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: "2021-02-8"
  }),
  // Expired => Needs to be deleted
  new TimeOff({
    policy_name: policies[1].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: "2021-02-2"
  })
];

const createPolicies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < policies.length; i++) {
        await policies[i].save();
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

const createTimeOffs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < timeOffs.length; i++) {
        await timeOffs[i].save();
      }
      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

module.exports = async () => {
  dotenv.config({ path: ".env.test" });
  const mongoDB = process.env.MONGO_URL;
  try {
    await mongoose.connect(mongoDB);
  } catch (e) {
    console.error(e);
  }
  const db = mongoose.connection;
  try {
    await db.collections["policies"].drop();
  } catch (e) {
    console.error(e);
  }
  try {
    await db.collections["timeoffs"].drop();
  } catch (e) {
    console.error(e);
  }
  await db.createCollection("policies");
  await db.createCollection("timeoffs");
  await createPolicies();
  await createTimeOffs();
  await mongoose.disconnect();
  await db.close();
};
