exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('organizations').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('organizations').insert({id: 1, name: "org1"}),
        knex('organizations').insert({id: 2, name: "Purdue"}),
        knex('organizations').insert({id: 3, name: "Google"})
      ]);
    });
};


