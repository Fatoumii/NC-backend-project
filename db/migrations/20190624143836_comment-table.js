exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable.string("author").references("users.username");
    commentTable.integer("article_id").references("article.article_id");
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at");
    commentTable.string("body");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comments");
};
