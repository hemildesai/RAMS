
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("organizations", function(table) {
    table.increments();
    table.string("name").notNullable();
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knenx.schema.dropTable("organizations");
};
