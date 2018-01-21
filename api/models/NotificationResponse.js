/**
 * NotificationResponse.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    notification: {model: 'notification'},
    recipient: {model: 'user'},
    response: {type: 'string'}
  }

};

