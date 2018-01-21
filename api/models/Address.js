/**
 * Address.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    line: {type: 'string'},
    landmark: {type: 'string'},
    pinCode: {type: 'string'},
    city: {type: 'string'},
    state: {type: 'string'},
    country: {type: 'string'},
    coordinates: {type: 'string'} // comma separated latitude and longitude eg: 11.124,98.456
  }

};

