
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('collections_resources', function (table) {
    table.integer('collection_id')
      .unsigned()
      .references('collections.id')
      .onDelete("CASCADE");

    table.integer('resource_id')
      .unsigned()
      .references('resources.id')
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("collections_resources");
};
