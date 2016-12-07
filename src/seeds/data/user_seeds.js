var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, username: "tu1", password: bcrypt.hashSync('12345', 10), team_id: 1, permissions: 1, organization_id: 1}),
        knex('users').insert({id: 2, username: "tu2", password: bcrypt.hashSync('12345', 10), team_id: 1, organization_id: 1}),
        knex('users').insert({id: 3, username: "tu3", password: bcrypt.hashSync('12345', 10), team_id: 1, organization_id: 1})
      ]);
    });
};
