process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function fetchArticles({ article_id }) {
  return connection
    .select("article.*")
    .count({ comment_count: "comments.comment_id" })
    .from("article")
    .leftJoin("comments", "comments.comment_id", "article.article_id")
    .groupBy("article.article_id");
}
module.exports = { fetchArticles };

//404 article not found
//400 bad req expecting an integer
