var _ = require('lodash');
var async = require('async');
import Resource from '../models/resource.js';

var algoliasearch = require('algoliasearch');
var client = algoliasearch("1W6YX64AEN", "625f888db6fb5a3f5410515f96c8efa5");
var resource_index = client.initIndex('resource');

Resource
  .fetchAll({withRelated: ["collections"]})
  .then(function(resources) {
    resources = resources.toJSON();

    resources = resources.map(function(resource) {
      resource.objectID = resource.id;
      resource.collections = resource.collections.map(function(collection) {
        return {
          title: collection.title
        };
      });
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
