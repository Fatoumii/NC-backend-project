exports.up = function(knex, Promise) {
  console.log("creating article table");
  return knex.schema.createTable("article", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title");
    articleTable.string("body");
    articleTable.integer("votes");
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at");
  });
};

exports.down = function(knex, Promise) {
  console.log("dropping article table");
  return knex.schema.dropTable("article");
};
