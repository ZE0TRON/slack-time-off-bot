function SelectorOption(text,value) {
    this.text = {
        type:"plain_text",
        text: text,
        emoji:true
    };
    this.value = value;
}
exports.SelectorOption =SelectorOption;
/*
 "text": {
                            "type": "plain_text",
                            "text": "Choice 1",
                            "emoji": true
                        },
                        "value": "value-0"

*/