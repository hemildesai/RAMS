var user_seeds = require("../data/user_seeds.js");
var resource_seeds = require("../data/resource_seeds.js");
var collection_seeds = require("../data/collection_seeds.js");

exports.seed = function(knex, Promise) {
  return user_seeds.seed(knex, Promise)
    .then(() => {
      return resource_seeds.seed(knex, Promise)
        .then(() => {
          return collection_seeds.seed(knex, Promise);
        });
    });
};
