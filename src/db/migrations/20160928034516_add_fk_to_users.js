
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.integer("team_id")
      .unsigned()
      .references("teams.id")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.dropForeign("team_id");
    table.dropColumn("team_id");
  });
};
