
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('collections_projects', function (table) {
    table.integer('project_id')
      .unsigned()
      .references('projects.id')
      .onDelete("CASCADE");

    table.integer('collection_id')
      .unsigned()
      .references('collections.id')
      .onDelete("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("collections_projects");
};
