/**
 *
 * @author Philip M. Turner
 *
 */

function GmailUtil() {
}

GmailUtil.prototype.send = function(startupData) {
  var moment = require('moment-timezone')().tz('America/Los_Angeles');

  const username = (process.env.GMAIL_USERNAME) ?
                      (process.env.GMAIL_USERNAME) : '';

  const password = (process.env.GMAIL_PASSWORD) ?
                      (process.env.GMAIL_PASSWORD) : '';

  const toEmail  = (process.env.TO_EMAIL) ?
                      (process.env.TO_EMAIL) : '';

  /* Get formatted date string for subject */
  const date    = moment.format('dddd MMM D, YYYY');
  const subject = `Task Report: ${date}`;

  /* Configure options for sending mail */
  const send = require('gmail-send')({
    user: username,
    pass: password,
    to:   toEmail,
    subject: subject
  });

  const sprintName          = startupData.sprintName;
  const completeTaskCount   = startupData.completedTasks.length;
  const stalledTaskCount    = startupData.stalledTasks.length;
  const inProgress          = startupData.requiresMoreWorkTasks.length;
  const allTaskCount        = completeTaskCount + stalledTaskCount + inProgress;

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

  send({
    html: html
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result);
  })
}

module.exports = new GmailUtil();
