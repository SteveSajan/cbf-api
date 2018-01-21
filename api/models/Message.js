/**
 * Message.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    subject: {type: 'string'},
    body: {type: 'string'},
    createdBy: {model: 'user'}
  }

};

