/**
 * Modified `find` blueprint to return urls for pagination
 * Original `find` source: ../../node_modules/sails/lib/hooks/blueprints/actions/find.js
 */
const URL = require('url');
const formatUsageError = require('../../node_modules/sails/lib/hooks/blueprints/formatUsageError');

/**
 * Find Records
 *
 * http://sailsjs.com/docs/reference/blueprint-api/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 */

module.exports = function findRecords(req, res) {

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'find';

  const queryOptions = req._sails.config.blueprints.parseBlueprintOptions(req);
  const Model = req._sails.models[queryOptions.using];

  let findQuery = req.query.search ? handleSearch(Model, req.query.search, queryOptions) : null;
  findQuery = findQuery ? findQuery : Model.find(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta);

  findQuery
    .then(matchingRecords => {
      return res.ok({
        data: matchingRecords,
        paging: {
          next: getNextUrl(req, queryOptions, matchingRecords),
          prev: getPrevUrl(req, queryOptions)
        }
      });
    })
    .catch(err => {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError':
          return res.badRequest(formatUsageError(err, req));
        default:
          return res.serverError(err);
      }
    });
};


function getNextUrl(req, queryOptions, matchingRecords) {
  const url = URL.parse(req.url, true);
  const limit = queryOptions.criteria.limit;
  const skip = url.query.skip ? parseInt(url.query.skip, 10) : 0;
  if (matchingRecords.length < limit) {
    return null;
  }
  delete url.search;
  url.query.limit = limit;
  url.query.skip = skip + limit;
  return url.format();
}

function getPrevUrl(req, queryOptions) {
  const url = URL.parse(req.url, true);
  const limit = queryOptions.criteria.limit;
  const skip = url.query.skip ? parseInt(url.query.skip, 10) : 0;
  if (!skip) {
    return null;
  }
  delete url.search;
  url.query.limit = limit;
  url.query.skip = skip - limit;
  return url.format();
}

function handleSearch(Model, searchParam, queryOptions) {
  let query;
  const modelName = queryOptions.using;
  switch (modelName) {
    case 'song':
      query = {
        $or: [
          {title: new RegExp(searchParam, 'i')},
          {number: parseInt(searchParam, 10)}
        ]
      };
      break;
  }
  if (query) {
    const db = Model.getDatastore().manager;
    const collection = db.collection(modelName);
    return collection.find(query).toArray();
  }
}
