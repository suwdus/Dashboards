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

S3Util.prototype.getObjectFromBucket = function(objectKey) {
    const s3 = configureS3(),
          params = {
              Bucket: getS3BucketString(process.env.BUCKET_KEY),
              Key: objectKey
          };

    return new Promise( (resolve, reject) => {
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log('Could not get object from bucket',err);
                reject(err);
            } else
                resolve(JSON.parse(data.Body.toString()));
        });
    });
}

S3Util.prototype.putEmailSent = function() {
    const s3 = configureS3(),
          moment = require('moment'),
          params = {
              Bucket: getS3BucketString(process.env.BUCKET_KEY),
              Body: JSON.stringify({lastSendDate: moment()}),
              Key: 'email-log.json'
          };

    return new Promise( (resolve, reject) => {

        s3.putObject(params, function(err, data) {
            if (err) {
                console.log('Could not get object from bucket',err);
                reject(err);
            } else
                resolve("Successfully put object to bucket");
        });
    });
}

function getS3BucketString(bucketStr) {
    return bucketStr
                    .replace('http://','')
                    .replace(/.s3.*/,'');
}

function configureS3() {
    const AWS = require('aws-sdk'),
          credentials = {};
          credentials.accessKeyId     = process.env.ACCESS_KEY_ID,
          credentials.secretAccessKey = process.env.SECRET_ACCESS_KEY;

          AWS.config.update(credentials);

    /* S3 must be constructed after the config is loaded. */
    return new AWS.S3({apiVersion: '2006-03-01'});
}


module.exports = new S3Util();
