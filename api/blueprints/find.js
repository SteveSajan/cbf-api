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

  const parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'find';

  const queryOptions = parseBlueprintOptions(req);
  const Model = req._sails.models[queryOptions.using];

  Model
    .find(queryOptions.criteria, queryOptions.populates).meta(queryOptions.meta)
    .exec(function found(err, matchingRecords) {
      if (err) {
        // If this is a usage error coming back from Waterline,
        // (e.g. a bad criteria), then respond w/ a 400 status code.
        // Otherwise, it's something unexpected, so use 500.
        switch (err.name) {
          case 'UsageError':
            return res.badRequest(formatUsageError(err, req));
          default:
            return res.serverError(err);
        }
      }

      return res.ok({
        data: matchingRecords,
        paging: {
          next: getNextUrl(req, queryOptions, matchingRecords)
        }
      });

    });

};


function getNextUrl(req, queryOptions, matchingRecords) {
  if (matchingRecords.length < queryOptions.criteria.limit) {
    return null;
  }
  const url = URL.parse(req.url, true);
  delete url.search;
  if (!url.query.skip) {
    url.query.skip = 0;
  }
  url.query.limit = queryOptions.criteria.limit;
  url.query.skip = parseInt(url.query.skip, 10) + queryOptions.criteria.limit;
  return url.format();
}
