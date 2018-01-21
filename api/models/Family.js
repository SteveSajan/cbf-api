/**
 * Family.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'string'},
    head: {model: 'user'},
    members: {collection: 'user', via: 'family'}
  }

};

