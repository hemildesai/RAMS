var fs = require("fs");

var data = fs.readFileSync("./data.json");
data = JSON.parse(data);

var knex_seeds = [];
var cr_seeds = [];

function randomIntInc (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

var count = 1;

data.data.forEach(function(item) {
  var resource = {};
  resource.id = count;
  resource.name = item.title[0];
  resource.link = item.link[0];
  resource.description = item.desc[0];
  resource.is_private = false
  if(count % 10 == 0) {
    resource.is_private = true;
  }
  resource.user_id = 1;
  if(count % 3 == 0) {
    resource.user_id = 2;
  }
  count = count + 1;
  knex_seeds.push(resource);
  cr_seeds.push({collection_id: randomIntInc(1,4), resource_id: count - 1});
});

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      return knex("collections_resources").del()
        .then(function() {
          return knex("resources").insert(knex_seeds)
            .then(function() {
              return knex("collections_resources").insert(cr_seeds);
            });
        });
    });
};
