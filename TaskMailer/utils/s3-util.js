/**
 *
 * Description: Fetches Task data from S3.
 *
 *
 * @author Philip M. Turner
 *
 */

function S3Util() {
}

S3Util.prototype.getObjectFromBucket = function() {
  return new Promise( (resolve, reject) => {
    const AWS             = require('aws-sdk');
    const uuid            = require('uuid');
    const credentials     = {};
    const objectKey       = 'tasks.json'

    credentials.accessKeyId     = process.env.ACCESS_KEY_ID;
    credentials.secretAccessKey = process.env.SECRET_ACCESS_KEY;

    //Set necessary credentials...
    AWS.config.update(credentials);
    //S3 object must be constructed after config load for creds to be captured.
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});

    const params = {
      Bucket: getS3BucketString(process.env.BUCKET_KEY),
      Key: objectKey
    };

    s3.getObject(params, function(err, data) {
      if (err) {
        console.log('Could not get object from bucket',err);
        reject(err);
      } else
        resolve(JSON.parse(data.Body.toString()));
    });
  });
}

function getS3BucketString(bucketStr) {
  return bucketStr
          .replace('http://','')
          .replace(/.s3.*/,'');
}

module.exports = new S3Util();
