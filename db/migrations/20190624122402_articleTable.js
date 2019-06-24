exports.up = function(knex, Promise) {
  console.log("creating topics table");
  return knex.schema.createTable("topics", topicTable => {
    topicTable.increments("slug").primary();
    topicTable.string("description");
  });
};

exports.down = function(knex, Promise) {
  console.log("dropping topics table");
  return knex.schema.dropTable("topics");
};
