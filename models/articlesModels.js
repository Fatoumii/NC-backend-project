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
    .where({ article_id }) //why the need to deconstruct again?
    .returning("*");
}

function updateComment(article_id, body, username) {
  return connection
    .insert({ author: username, body, article_id })
    .into("comments")
    .returning("*")
    .then(newComment => newComment);
}

function fetchCommentByID(article_id) {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id });
}

module.exports = {
  fetchArticles,
  changedVote,
  updateComment,
  fetchCommentByID
};
