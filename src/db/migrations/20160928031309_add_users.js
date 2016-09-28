
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments();
    table.string("username").unique().notNullable();
    table.string("password").notNullable();
		table.integer("permissions").defaultTo(0).notNullable();
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
