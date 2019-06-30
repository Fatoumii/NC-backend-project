exports.up = function(knex, Promise) {
  return knex.schema.createTable("article", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.string("body", 100000).notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articleTable
      .string("author")
      .references("users.username")
      .notNullable();
    articleTable.timestamp("created_at").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("article");
};
