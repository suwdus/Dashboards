/**
 *
 * Sends an email containing tasks related to specified startup.
 *
 * @author Philip M. Turner
 *
 */


function sendTaskerUpdateEmail() {
    const moment    = require('moment'),
          s3Util    = require('./utils/s3-util'),
          dataUtil  = require('./utils/data-util'),
          gmailUtil = require('./utils/gmail-util'),
          now       = moment(),
          emailSent = false;


    s3Util.getObjectFromBucket('email-log.json')
    .then( ({lastSendDate}) => { /* See if we've already sent an email */

        if (moment(lastSendDate).date() === now.date()) {
            return Promise.reject('Already sent email today, nothing left to do.');
        }

    }).then( () => { /* Get the email data from the bucket */

        return s3Util.getObjectFromBucket('tasks.json');

    }).then( object => { /* Send the email */

        return gmailUtil.send(dataUtil.buildStartupData(object));

    }).then( () => { /* Record that the email was sent */

        s3Util.putEmailSent();

    }).catch((err) => {

        console.log(err);

    });

}

exports.handler = sendTaskerUpdateEmail;
