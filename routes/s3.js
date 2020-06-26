var express = require('express');
var app = express();
var path = require('path');
var pathToJson = path.resolve(__dirname, '../config.json');

var AWS = require('aws-sdk');
var uuid = require('uuid');
var keyName = 'hello_world.txt';

var bucketName = 'nodebucket' + uuid.v4();


AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

var s3 = new AWS.S3();

// Los nombres de buckets deben ser únicos entre todos los usuarios de S3
var myBucket = 'my.unique.bucket.name';
var myKey = 'myBucketKey';




//Rutas
app.get('/', (request, resp, next) => {

    AWS.config.loadFromPath(pathToJson);

    var bucketPromise = new AWS.S3({ apiVersion: '2020-03-01' }).createBucket({ Bucket: bucketName }).promise();

    // Handle promise fulfilled/rejected states
    bucketPromise.then(
        function(data) {
            // Create params for putObject call
            var objectParams = { Bucket: bucketName, Key: keyName, Body: 'Hello World!' };
            // Create object upload promise
            var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
            uploadPromise.then(
                function(data) {
                    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
                });
        }).catch(
        function(err) {
            console.error(err, err.stack);
        });

    resp.status(200).json({
        mensaje: 'peticion correcta',
        ok: true
    });
});

module.exports = app