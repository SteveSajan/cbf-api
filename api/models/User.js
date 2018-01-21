/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'string', required: true},
    email: {type: 'string'},
    password: {type: 'string'},
    phone: {type: 'string'},
    gender: {type: 'string', required: true, isIn: ['male', 'female']},
    maritalStatus: {
      type: 'string',
      defaultsTo: 'single',
      isIn: ['single', 'married']
    },
    address: {model: 'address'},
    dob: {type: 'string'},
    profession: {type: 'string', isIn: ['student', 'working', 'housewife', 'ministry']},
    picture: {type: 'string'},
    family: {collection: 'family', via: 'members'},
    active: {type: 'boolean'}
  }

};

