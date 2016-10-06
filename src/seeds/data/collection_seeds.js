
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('collections').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('collections').insert({id: 1, title: "test tech", is_private: false, user_id: 1}),
        knex('collections').insert({id: 2, title: "test sports", is_private: false, user_id: 1}),
        knex('collections').insert({id: 3, title: "test entertainment", is_private: true, user_id: 2}),
        knex('collections').insert({id: 4, title: "test music", is_private: true, user_id: 1})
      ]);
    });
};
