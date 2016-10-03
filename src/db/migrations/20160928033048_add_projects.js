
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("projects", function(table) {
    table.increments();
    table.string("title").notNullable();
    table.boolean("is_private").defaultTo(false).notNullable();
    table.integer("user_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knenx.schema.dropTable("projects");
};
