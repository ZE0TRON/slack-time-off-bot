const Policy = require("../../api/model/policy");
const TimeOff = require("../../api/model/timeOff");
const build_kit = require("../../api/util/build-kit");
const users = [
  { user_id: "U134123", user_name: "user1" },
  { user_id: "U234234", user_name: "user2" },
  { user_id: "U343566", user_name: "user3" }
];

const policies = [
  new Policy({ name: "pol1", max_day: 5 }),
  new Policy({ name: "pol2", max_day: 2 }),
  // Will be Deleted in test
  new Policy({ name: "pol3", max_day: 3 }),
  //
  new Policy({ name: "pol4", max_day: 4 }),
  new Policy({ name: "pol5", max_day: 100 })
];

const nextMonday = new Date();
nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
const nextMondayString = build_kit.toSlackDate(nextMonday);
const nextYear1 = new Date();
nextYear1.setDate(nextYear1.getDate() + 365);
const nextYear1String = build_kit.toSlackDate(nextYear1);

const nextYear2 = new Date();
nextYear2.setDate(nextYear2.getDate() + 366);
const nextYear2String = build_kit.toSlackDate(nextYear2);

const nextMonth = new Date();
nextMonth.setDate(nextMonth.getDate() + 30);
const nextMonthString = build_kit.toSlackDate(nextMonth);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = build_kit.toSlackDate(yesterday);

const thisWeek1 = new Date();
thisWeek1.setDate(thisWeek1.getDate() + 1);
const thisWeek1String = build_kit.toSlackDate(thisWeek1);

const thisWeek2 = new Date();
thisWeek2.setDate(thisWeek2.getDate() + 2);
const thisWeek2String = build_kit.toSlackDate(thisWeek2);

const timeOffs = [
  // In the future
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[0].user_name,
    user_id: users[0].user_id,
    date: nextMondayString
  }),
  // Will be deleted in test
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[1].user_name,
    user_id: users[1].user_id,
    date: nextYear1String
  }),
  //
  new TimeOff({
    policy_name: policies[1].name,
    user_name: users[1].user_name,
    user_id: users[1].user_id,
    date: nextMonthString
  }),
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: nextYear2String
  }),
  new TimeOff({
    policy_name: policies[0].name,
    user_name: users[0].user_name,
    user_id: users[0].user_id,
    date: nextYear1String
  }),
  // In this week
  // TODO: automate this to this week
  new TimeOff({
    policy_name: policies[4].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: thisWeek1String
  }),
  new TimeOff({
    policy_name: policies[2].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: thisWeek2String
  }),
  // Expired => Needs to be deleted
  new TimeOff({
    policy_name: policies[1].name,
    user_name: users[2].user_name,
    user_id: users[2].user_id,
    date: yesterdayString
  })
];
exports.users = users;
exports.timeOffs = timeOffs;
exports.policies = policies;
