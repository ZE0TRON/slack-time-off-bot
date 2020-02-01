const policyController = require("../controllers/policy");
function SelectorOption(text,value) {
    return {
        text : {
            type:"plain_text",
            text: text,
            emoji:true
        },
        value : value
    };
}
exports.SelectorOption =SelectorOption;

exports.addPoliciesToMultiSelect = (template)=> {
    return new Promise((resolve,reject)=> {
        policyController.getPolicies().then(policies => {
          let options = [];
          console.log(policies.length);
          for (let i = 0; i < policies.length; i++) {
            console.log("In loop");
            options.push(SelectorOption(policies[i].name, policies[i].name));
          }
          console.log("After Loop");
          template.blocks[0].accessory.options = options;
          resolve(template);
        }).catch(err => {
            reject(err);
        });
    });
};