/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_ESPCHESSUSERS_ARN
	STORAGE_ESPCHESSUSERS_NAME
Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk');

exports.handler = async function(event, context) {
    var iot = new AWS.Iot();
    var wut = await iot.createThing({
        thingName: "test-api-thing",
    }).promise();
    
    console.log(wut);

    // console.log(wut);

    return {
        aws_cert_ca: "hello world"
    };
};
