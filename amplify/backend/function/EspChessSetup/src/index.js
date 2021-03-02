var AWS = require('aws-sdk');

const AWS_CERT_CA = "-----BEGIN CERTIFICATE-----\n" +
    "MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF\n" +
    "ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6\n" +
    "b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL\n" +
    "MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv\n" +
    "b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj\n" +
    "ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM\n" +
    "9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw\n" +
    "IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6\n" +
    "VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L\n" +
    "93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm\n" +
    "jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC\n" +
    "AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA\n" +
    "A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI\n" +
    "U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs\n" +
    "N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv\n" +
    "o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU\n" +
    "5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy\n" +
    "rqXRfboQnoZsG4q5WTP468SQvvG5\n" +
    "-----END CERTIFICATE-----\n";

exports.handler = async function(event, context) {
    // TODO:  Remove me.
    console.log("Event");
    console.log(event);
    console.log("Context");
    console.log(context);
    console.log("----");

    var iot = new AWS.Iot();

    const thingName = "espchess-" + event.identity.username;

    // Create a new IoT "thing"
    var iotThing = await iot.createThing({
        thingName: thingName,
        thingTypeName: "espchess",
    }).promise();
    
    //TODO:  Setup a new datastore.

    // Add the thing to the board group
    var thingGroupResult = await iot.addThingToThingGroup({
        thingName: thingName,
        thingGroupName: "espchess",
    }).promise();
    console.log("Thing group result: " + JSON.stringify(thingGroupResult));

    // Create a new Cert to attach to this thing
    var certResult = await iot.createKeysAndCertificate({
        setAsActive: true
    }).promise();
    console.log("Certificate result: " + JSON.stringify(certResult));

    // Attach the generated certificate to the created device
    var attachResult = await iot.attachThingPrincipal({
        thingName: thingName,
        principal: certResult.certificateArn,
    }).promise();
    console.log("Attach result: " + JSON.stringify(attachResult));

    var ret = {
        thingName: thingName,
        awsCertCa: AWS_CERT_CA,
        awsCertPrivate: certResult.keyPair.PrivateKey,
        awsCertCrt: certResult.certificatePem,
    };
    console.log("Returning: " + JSON.stringify(ret))
    return ret;
};
