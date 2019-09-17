/**
 *
 * Performs various filters on tasks and returns resulting list.
 *
 * @author Philip M. Turner
 *
 */

function DataUtil() {
}

DataUtil.prototype.getStartupData = function(startupData) {
  var _ = require('underscore');

  const tasks = this.getTasksForCurrentSprint(startupData);

  const sprintId = startupData.currentSprintId;

  var alexaData = {
    sprintName: startupData.sprints[sprintId].name,
    stalledTasks: [],
    completedTasks: [],
    requiresMoreWorkTasks: [],
    totalTasksInSprint: 0
  };


  _.forEach(tasks, function(task) {
    if (task.complete) {
      alexaData.completedTasks.push(task);
    } else if (isTaskStalled(task)) {
      alexaData.stalledTasks.push(task);
    } else {
      alexaData.requiresMoreWorkTasks.push(task);
    }
    alexaData.totalTasksInSprint++;
  });

  return alexaData;
}

DataUtil.prototype.getTasksForCurrentSprint = function(startupData) {
  var _ = require('underscore');

  const sprintTasks = startupData.sprints[startupData.currentSprintId].sprintTasks;

  const tasks = _.map(sprintTasks, (sprintTask) => {
    return startupData.tasks[sprintTask.taskId]
  });
  return tasks;
}

function isTaskStalled(task) {
  var _ = require('underscore');
  var moment = require('moment');

  if (_.isEmpty(task.annotations))
    return true;

  const lastAnnotation = _.max(task.annotations, (annotation) => {
    return moment(annotation.date).unix()
  });

  const twoDaysAgo          = moment().subtract({hours: 48});
  const lastAnnotationDate  = moment(lastAnnotation.date);

  if (lastAnnotationDate.isAfter(twoDaysAgo)) {
    return false;
  } else {
    return true;
  }
}
module.exports = new DataUtil();
