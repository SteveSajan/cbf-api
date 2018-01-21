const Promise = require('bluebird');

/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

function sendNotification(recipient, message) {
  console.log(`Sent message ${message.subject} : ${message.body} to ${recipient.name}`);
  return Promise.resolve();
}

function sendNotifications(recipients = [], message) {
  const promises = recipients.map(recipient => {
    return sendNotification(recipient, message);
  });
  return Promise.all(promises);
}

function getUniqueUsers(users) {
  const uniqueUsers = [];
  users.forEach(user => {
    const userExists = uniqueUsers.find(userInArr => user.id === userInArr.id);
    if (!userExists) uniqueUsers.push(user);
  });
  return uniqueUsers;
}

function processNotification(notification) {
  let promise;
  if (notification.recipients.length) {
    promise = sendNotifications(notification.recipients, notification.message);
  } else {
    let recipients = notification.users;
    const groupsPromises = notification.groups.map(group => Group.findOne(group.id).populate('members'));
    promise = Promise.all(groupsPromises)
      .then(groups => {
        return groups.reduce((recipients, group) => recipients.concat(group.members), recipients);
      })
      .then(recipients => getUniqueUsers(recipients))
      .then(recipients => sendNotifications(recipients, notification.message))
      .catch(err => {
        console.error(err);
      });
  }

  return promise
    .then(responses => {
      // const isDone = failedRecipients.length === 0;
      return Notification.update({id: notification.id})
        .set({
          recipients: [],
          done: false
        });
    });
}

module.exports = {
  send(req, res) {
    Notification
      .find({
        sendAt: {'<': (new Date()).getTime() / 1000},
        done: false
      })
      .populate('groups')
      .populate('users')
      .populate('recipients')
      .populate('message')
      .then(notifications => notifications.map(notification => processNotification(notification)))
      .then(notificationsPromises => Promise.all(notificationsPromises))
      .then(() => {
        res.send('Success!');
      });
  }
};

