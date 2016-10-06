exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('teams').insert({id: 1, name: "team1", organization_id: 1}),
        knex('teams').insert({id: 2, name: "teamname", organization_id: 2}),
        knex('teams').insert({id: 3, name: "awesome team", organization_id: 3})
      ]);
    });
};


