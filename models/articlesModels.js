process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function fetchArticles({ article_id }) {
  return connection
    .select("article.*")
    .count({ comment_count: "comments.comment_id" })
    .from("article")
    .where("article.article_id", "=", article_id)
    .leftJoin("comments", "comments.comment_id", "article.article_id")
    .groupBy("article.article_id")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
}

function changedVote(article_id, inc_votes) {
  return connection
    .increment("votes", inc_votes)
    .from("article")
    .where({ article_id })
    .returning("*");
}

module.exports = { fetchArticles, changedVote };
