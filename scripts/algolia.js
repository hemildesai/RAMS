var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
import Resource from '../src/server/models/resource.js';
import Collection from '../src/server/models/collection.js';

var algoliasearch = require('algoliasearch');
var client = algoliasearch("1W6YX64AEN", "625f888db6fb5a3f5410515f96c8efa5");
var resource_index = client.initIndex('resource');

Resource
  .fetchAll({withRelated: ["collections", "tags"]})
  .then(function(resources) {
    var mres = resources;
    resources = resources.toJSON();

    resources = mres.map(function(resource) {
      var objectID = resource.id;
      var collections = resource.toJSON().collections.map(function(collection) {
        return {
          title: collection.title
        };
      });

      var tags = resource.toJSON().tags.map(function(tag) {
        return {
          title: tag.title
        };
      });

      resource = resource.toJSON();
      resource.objectID = objectID;
      resource.collections = collections;
      resource.tags = tags;

      return resource;
    });

    var chunkedResults = _.chunk(resources, 5000);

    async.each(chunkedResults, resource_index.saveObjects.bind(resource_index), end);
  });

function end(err) {
  if (err) {
    throw err;
  }

  console.log('Algolia import done')
  process.exit();
};
