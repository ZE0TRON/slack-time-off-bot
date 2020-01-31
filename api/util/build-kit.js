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
/*
 "text": {
                            "type": "plain_text",
                            "text": "Choice 1",
                            "emoji": true
                        },
                        "value": "value-0"

*/