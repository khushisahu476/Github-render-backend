const dotenv = require('dotenv');
dotenv.config();

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});


const s3 = new AWS.S3();
const S3_BUCKET = 'samplekhushibucket';

module.exports= {s3, S3_BUCKET};




