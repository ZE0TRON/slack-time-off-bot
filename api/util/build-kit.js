const policyController = require("../controllers/policy");
function SelectorOption(text, value) {
  return {
    text: {
      type: "plain_text",
      text: text,
      emoji: true
    },
    value: value
  };
}

exports.SelectorOption = SelectorOption;

exports.addPoliciesToMultiSelect = (template,isInput) => {
  return new Promise((resolve, reject) => {
    policyController
      .getPolicies()
      .then(policies => {
        let options = [];
        console.log(policies.length);
        for (let i = 0; i < policies.length; i++) {
          console.log("In loop");
          options.push(SelectorOption(policies[i].name, policies[i].name));
        }
        console.log("After Loop");
        if(isInput) {
            template.blocks[0].element.options = options;
        }
        else {
            template.blocks[0].accessory.options = options;
        }
        resolve(template);
      })
      .catch(err => {
        reject(err);
      });
  });
};
// Date format => 1990-04-28
exports.changeInitialDate = (template, blockIndex, date) => {
  template.blocks[blockIndex].element.initial_date = date;
  return template;
};

exports.timeOffCancelButton = (date,policy)=> {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Date : "+date+"\n Policy: "+policy.name
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Cancel",
          emoji: true
        },
        value: date+"/"+policy.name
      }
    };
};