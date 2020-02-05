const dotenv = require("dotenv");
const mongoose = require("mongoose");
const policies = require("./data/data").policies;
const timeOffs = require("./data/data").timeOffs;

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
