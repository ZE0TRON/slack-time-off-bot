const Policy = require("../model/policy");
const timeOffListTemplate = require("../../build_kit_templates/timeOffList.json");
/**
 * Creates a selector option in slack build kit format
 * @param  {string} text
 * @param  {string} value
 * @return {Object}
 */
function selectorOption(text, value) {
  return {
    text: {
      type: "plain_text",
      text: text,
      emoji: true
    },
    value: value
  };
}
/**
 * Creates a list element for time offs
 * @param  {string} date
 * @param  {Object} policy
 * @param  {number} index
 * @return {Object}
 */
function timeOffCancelButton(date, policy, index) {
  return {
    block_id: "cancel_timeoff" + "/" + index,
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Date : " + date + "\n Policy: " + policy
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Cancel",
        emoji: true
      },
      value: date + "/" + policy
    }
  };
}
/**
 * @param  {Object} timeOffs
 * @return {Object}
 */
function createTimeOffList(timeOffs) {
  for (let i = 0; i < timeOffs.length; i++) {
    let timeOffItem = {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*User* : <" +
          timeOffs[i].user_id +
          "> \n *Policy* : " +
          timeOffs[i].policy_name +
          " \n *Date*: " +
          timeOffs[i].date
      }
    };
    let divider = {
      type: "divider"
    };
    timeOffListTemplate.blocks.push(timeOffItem);
    timeOffListTemplate.blocks.push(divider);
  }
  return timeOffListTemplate;
}

// Adds the current policies to given multi select
/**
 * @param  {Object} template => Multi Select Template
 * @param  {boolean} isInput => Whether the given multi select is a part of input block or not
 * @return {Promise}
 */
exports.addPoliciesToMultiSelect = (template, isInput) => {
  return new Promise((resolve, reject) => {
    Policy.getPolicies()
      .then(policies => {
        const options = [];
        console.log(policies.length);
        for (let i = 0; i < policies.length; i++) {
          options.push(
            selectorOption(
              policies[i].name + " - " + policies[i].max_day + " days",
              policies[i].name
            )
          );
        }
        if (isInput) {
          template.blocks[0].element.options = options;
        } else {
          template.blocks[0].accessory.options = options;
        }
        resolve(template);
      })
      .catch(err => {
        reject(err);
      });
  });
};
// Changes the initial date of slack's date picker
// Date format => 1990-04-28
// BlockIndex => In which block the date picker is placed in the template
exports.changeInitialDate = (template, blockIndex, date) => {
  template.blocks[blockIndex].element.initial_date = date;
  return template;
};

exports.selectorOption = selectorOption;
exports.timeOffCancelButton = timeOffCancelButton;
exports.createTimeOffList = createTimeOffList;
