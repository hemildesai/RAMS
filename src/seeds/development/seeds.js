var user_seeds = require("../data/user_seeds.js");
var resource_seeds = require("../data/resource_seeds.js");
var collection_seeds = require("../data/collection_seeds.js");
var organization_seeds = require("../data/organizations_seeds.js");
var team_seeds = require("../data/teams_seeds.js");
var project_seeds = require("../data/project_seeds.js");

exports.seed = function(knex, Promise) {
  return organization_seeds.seed(knex, Promise)
    .then(() => {
      return team_seeds.seed(knex, Promise)
        .then(() => {
          return user_seeds.seed(knex, Promise)
            .then(() => {
              return project_seeds.seed(knex, Promise)
                .then(() => {
                  return resource_seeds.seed(knex, Promise)
                    .then(() => {
                      return collection_seeds.seed(knex, Promise);
                    });
                });
            });
        });
    });
};
