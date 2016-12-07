
exports.up = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.integer("organization_id")
      .unsigned()
      .references("organizations.id")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(table) {
    table.dropForeign("organization_id");
    table.dropColumn("organization_id");
  });
};
