const policyController = require("../controllers/policy");

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
      text: "Date : " + date + "\n Policy: " + policy.name
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Cancel",
        emoji: true
      },
      value: date + "/" + policy.name
    }
  };
}
// Adds the current policies to given multi select
/**
 * @param  {Object} template => Multi Select Template
 * @param  {boolean} isInput => Whether the given multi select is a part of input block or not
 * @return {Promise}
 */
exports.addPoliciesToMultiSelect = (template, isInput) => {
  return new Promise((resolve, reject) => {
    policyController
      .getPolicies()
      .then(policies => {
        const options = [];
        console.log(policies.length);
        for (let i = 0; i < policies.length; i++) {
          console.log("In loop");
          options.push(selectorOption(policies[i].name, policies[i].name));
        }
        console.log("After Loop");
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
