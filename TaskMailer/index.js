/**
 *
 * Sends an email containing tasks related to specified startup.
 *
 * @author Philip M. Turner
 *
 */


function sendTaskerUpdateEmail() {
  const DataUtil  = require('./utils/data-util');
  const GmailUtil = require('./utils/gmail-util');

  require('./utils/s3-util').getObjectFromBucket()
  .then((data) => {

    const startupData = DataUtil.getStartupData(data);

    GmailUtil.send(startupData);
  }).catch((err) => {
    console.log('Unable to send email', err);
  });

}

exports.handler = sendTaskerUpdateEmail;
