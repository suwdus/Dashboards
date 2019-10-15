/**
 *
 * @author Philip M. Turner
 *
 */

function GmailUtil() {
}

GmailUtil.prototype.send = function(startupData) {
  const moment = require('moment-timezone')().tz('America/Los_Angeles'),
        /* Gmail configuration variables */
        username = (process.env.GMAIL_USERNAME) ?
                      (process.env.GMAIL_USERNAME) : '',
        password = (process.env.GMAIL_PASSWORD) ?
                      (process.env.GMAIL_PASSWORD) : '',
        toEmail  = (process.env.TO_EMAIL) ?
                      (process.env.TO_EMAIL) : '',

        /* Template key variables */
        date              = moment.format('dddd MMM D, YYYY'),
        subject           = `Task Report: ${date}`,
        sprintName        = startupData.sprintName,
        completeTaskCount = startupData.completedTasks.length,
        stalledTaskCount  = startupData.stalledTasks.length,
        inProgress        = startupData.requiresMoreWorkTasks.length,
        allTaskCount      = completeTaskCount + stalledTaskCount + inProgress;

    /* HTML body configuration */
    var html = `The current sprint is titled, <b>${sprintName}</b>.<br><br>`
                        + `Of the ${allTaskCount} tasks belonging to the sprint `
                        + `${completeTaskCount} are complete and ${inProgress} `
                        + `requires more work. ${stalledTaskCount} tasks are stalled.<br><br> `;

    html += `<b>Completed Tasks</b><br>`;
    startupData.completedTasks.forEach( task => html+= `<i>${task.title}</i><br>`);
    html += `<br>`;

    html += `<b>In-Progress Tasks</b><br>`;
    startupData.requiresMoreWorkTasks.forEach( task => html+= `<i>${task.title}</i><br>`);
    html += `<br>`;

    html += `<b>Stalled Tasks</b><br>`;
    startupData.stalledTasks.forEach( task => html+= `<i>${task.title}</i><br>`);

    /* Configure options for sending mail */
    const send = require('gmail-send')({
        user: username,
        pass: password,
        to:   toEmail,
        subject: subject
    });

    //Will return a promise https://www.npmjs.com/package/gmail-send
    return send({
        html: html
    });
}

module.exports = new GmailUtil();
