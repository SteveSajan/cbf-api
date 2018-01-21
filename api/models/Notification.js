/**
 * Notification.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    message: {model: 'message', required: true},
    users: {collection: 'user'}, // Individual users to whom you want to send this notification
    groups: {collection: 'group'}, // Groups to whom you want to send this notification
    // To start off, recipients will be empty
    // When the system starts to process a notification, this will be a Union of users
    // and users from each group.
    // When a notification has been sent to a user in this list, we remove the user from this list.
    // Once the notification has been processed, any remaining user in recipients will be those
    // to whom the system failed to send a notification.
    recipients: {collection: 'user'},
    // Timestamp when this notification should be processed
    // By default, it will be the current time, but you can set it to a future date to allow for
    // reminder-like functionality
    sendAt: {type: 'number', columnType: 'date'},
    done: {type: 'boolean', defaultsTo: false}
  }

};

