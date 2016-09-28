
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("resources", function(table) {
    table.increments();
    table.string("name");
    table.string("link").notNullable();
		table.text("description");
    table.boolean("is_private").defaultTo(false).notNullable();
    table.integer("user_id")
      .unsigned()
      .references("users.id")
      .onDelete("CASCADE");
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knenx.schema.dropTable("resources");
};
