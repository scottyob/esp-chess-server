/* Amplify Params - DO NOT EDIT
	API_ESPCHESSSERVER_GRAPHQLAPIENDPOINTOUTPUT
	API_ESPCHESSSERVER_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk');
//TODO:  Put this in a variable
var iotdata = new AWS.IotData({ endpoint: 'a37u0bfoinvf2q-ats.iot.us-west-2.amazonaws.com' });

// Color effects
const OFF = 0;
const RED = 1;
const GREEN = 2;
const BLUE = 3;
const ORAGE = 4;
const LIGHTGREEN = 5;

exports.handler = async(event, context) => {

    const responseTopic = 'state/' + event.devName;
    var params = {
        topic: responseTopic,
        payload: JSON.stringify({ state: event.state }), // Simple echo at the moment
        qos: 0
    };
    console.log(event);
    console.log(params);


    return iotdata.publish(params).promise();



};
