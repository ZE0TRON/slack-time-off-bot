const build_kit = require("../api/util/build-kit");

test("Date Format", () => {
  const dateBefore = ["2020-02-20", "2020-12-02", "1995-11-30"];
  const dateAfter = ["02/20/2020", "12/02/2020", "11/30/1995"];
  for (let i = 0; i < dateBefore.length; i++) {
    expect(build_kit.dateFormat(dateBefore[i])).toBe(dateAfter[i]);
  }
});
test("To Slack Date", () => {});
