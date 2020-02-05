const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TimeOff = require("../api/model/timeOff");
const TimeOffController = require("../api/controllers/timeOff");
const policies = require("./data/data").policies;
const timeOffs = require("./data/data").timeOffs;
const users = require("./data/data").users;
const build_kit = require("../api/util/build-kit");
const announcement = require("../api/util/announcement");
describe("TimeOff", () => {
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

  it("Should Get TimeOffs of User", async () => {
    const userTimeOffs = await TimeOff.getTimeOffsByUser(users[1].user_name);
    expect(userTimeOffs).toHaveLength(2);
  });

  it("Should Get All TimeOffs", async () => {
    const dbTimeOffs = await TimeOff.getTimeOffs();
    expect(dbTimeOffs).toHaveLength(timeOffs.length);
    for (let i = 0; i < dbTimeOffs.length; i++) {
      expect(dbTimeOffs[i].date).toBe(timeOffs[i].date);
      expect(dbTimeOffs[i].user_name).toBe(timeOffs[i].user_name);
      expect(dbTimeOffs[i].user_id).toBe(timeOffs[i].user_id);
      expect(dbTimeOffs[i].policy_name).toBe(timeOffs[i].policy_name);
    }
  });

  it("Should Delete TimeOff", async () => {
    await TimeOffController.cancelTimeOff(
      timeOffs[1].date,
      timeOffs[1].policy_name,
      timeOffs[1].user_name
    );
    try {
      await TimeOffController.cancelTimeOff(
        timeOffs[1].date,
        timeOffs[1].policy_name,
        timeOffs[1].user_name
      );
    } catch (e) {
      expect(e).toBeTruthy();
    }
    const userTimeOffs = await TimeOff.getTimeOffsByUser(users[1].user_name);
    expect(userTimeOffs).toHaveLength(1);
    const dbTimeOffs = await TimeOff.getTimeOffs();
    expect(dbTimeOffs).toHaveLength(timeOffs.length - 1);
    expect(dbTimeOffs[1].date).not.toBe(timeOffs[1].date);
  });

  it("Should Create a TimeOff", async () => {
    const policyName = policies[1].name;
    const date = "2020-05-02";
    const user_id = users[2].user_id;
    const user_name = users[2].user_name;
    await TimeOffController.createTimeOff(policyName, date, user_name, user_id);
    let includes = false;
    const userTimeOffs = await TimeOff.getTimeOffsByUser(users[2].user_name);
    for (let i = 0; i < userTimeOffs.length; i++) {
      if (userTimeOffs[i].date === "2020-05-02") {
        includes = true;
      }
    }
    expect(includes).toBe(true);
    try {
      await TimeOffController.createTimeOff(
        policies[2].name,
        date,
        user_name,
        user_id
      );
    } catch (e) {
      expect(e.msg).toBe("You already have time off request for this date");
    }
    try {
      const today = new Date();
      today.setDate(today.getDate() - 1);
      const newDate = build_kit.toSlackDate(today);
      await TimeOffController.createTimeOff(
        policyName,
        newDate,
        user_name,
        user_id
      );
    } catch (e) {
      expect(e.msg).toBe("Can't Request Time Off in The Past");
    }
    const dbTimeOffs = await TimeOff.getTimeOffs();
    expect(dbTimeOffs).toHaveLength(timeOffs.length);
  });
  it("Should Filter TimeOffs", async () => {
    let dbTimeOffs = await TimeOff.getTimeOffs();
    const results = await announcement.filterTimeOffs(dbTimeOffs);
    const expiredTimeOffs = results.expired;
    const thisWeekTimeOffs = results.thisWeek;
    expect(expiredTimeOffs).toHaveLength(1);
    expect(thisWeekTimeOffs).toHaveLength(2);
    dbTimeOffs = await TimeOff.getTimeOffs();
    expect(dbTimeOffs).toHaveLength(timeOffs.length);
  });
});
