exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('projects').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('projects').insert({id: 1, title: "project1", is_private: false, user_id: 1}),
        knex('projects').insert({id: 2, title: "another project", is_private: true, user_id: 1}),
        knex('projects').insert({id: 3, title: "project3", is_private: false, user_id: 2})
        knex('projects').insert({id: 4, title: "private project", is_private: true, user_id: 1})
      ]);
    });
};

