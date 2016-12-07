
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("tags", function(table) {
    table.increments();
    table.string("title").notNullable();
    table.integer("resource_id")
      .unsigned()
      .references("resources.id")
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knenx.schema.dropTable("tags");
};
