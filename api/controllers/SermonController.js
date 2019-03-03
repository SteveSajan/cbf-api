/**
 * SermonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const request = require('request');

module.exports = {

  sync: (req, res) => {

    const models = [
      {
        syncUrl: 'http://www.cbfchurch.in/wp-json/wp/v2/wpfc_preacher',
        name: "sermonpreacher"
      },
      {
        syncUrl: 'http://www.cbfchurch.in/wp-json/wp/v2/wpfc_bible_book',
        name: "sermonbiblebook"
      },
      {
        syncUrl: 'http://www.cbfchurch.in/wp-json/wp/v2/wpfc_sermon_topics',
        name: "sermontag"
      },
      {
        syncUrl: 'http://www.cbfchurch.in/wp-json/wp/v2/wpfc_sermon_series',
        name: "sermonseries"
      }
    ];

    models.forEach(model => {
      request({url: model.syncUrl, json: true}, (err, res, records) => {
        if (err) return console.error(err);
        const Model = req._sails.models[model.name];
        records.forEach(record => {
          Model.findOrCreate({websiteId: record.id}, {websiteId: record.id, name: record.name})
            .then(() => console.log('1 record found/added'));
        });
      });
    });

    res.ok('done daaa');
  }

};

