process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function fetchArticlesByID({ article_id }) {
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

function updateComment(article_id, body, username) {
  return connection
    .insert({ author: username, body, article_id })
    .into("comments")
    .returning("*")
    .then(newComment => newComment);
}

function fetchCommentByID(sort_by, order, article_id) {
  const arr = [undefined, "asc", "desc"];
  if (!arr.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by || "created_at", order || "desc");
}

function fetchArticles(sort_by, order) {
  const arr = [undefined, "asc", "desc"];
  if (!arr.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return connection("article")
    .select("article.*")
    .count({ comment_count: "comments.comment_id" })
    .from("article")
    .leftJoin("comments", "comments.comment_id", "article.article_id")
    .groupBy("article.article_id")
    .orderBy(sort_by || "created_at", order || "desc");
}

module.exports = {
  fetchArticlesByID,
  changedVote,
  updateComment,
  fetchCommentByID,
  fetchArticles
};
