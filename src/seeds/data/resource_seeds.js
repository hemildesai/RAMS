
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('resources').insert({id: 1, name: "google", link: "google.com", is_private: false, user_id: 1}),
        knex('resources').insert({id: 2, name: "facebook", link: "facebook.com", is_private: false, user_id: 1}),
        knex('resources').insert({id: 3, name: "producthunt", link: "producthunt.com", is_private: true, user_id: 2}),
        knex('resources').insert({id: 4, name: "twitter", link: "twitter.com", is_private: true, user_id: 1})
      ]);
    });
};
