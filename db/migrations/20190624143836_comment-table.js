exports.up = function(knex, Promise) {
  console.log("creating comment table");
  return knex.schema.createTable("comments", commentTable => {
    commentTable.integer("comment_id").primary();
    commentTable.string("author").references("users.username");
    commentTable.integer("article_id").references("article.article_id");
    commentTable.integer("votes");
    commentTable.timestamp("created_at");
    commentTable.string("body");
  });
};

exports.down = function(knex, Promise) {
  ("dropping comment table");
  return knex.schema.dropTable("comments");
};
