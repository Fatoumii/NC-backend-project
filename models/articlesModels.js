process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function fetchArticlesByID({ article_id }) {
  return connection
    .select("article.*")
    .count({ comment_count: "comments.comment_id" })
    .from("article")
    .where("article.article_id", "=", article_id)
    .leftJoin("comments", "comments.article_id", "article.article_id")
    .groupBy("article.article_id")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
}

function changedVote(article_id, inc_votes = 0) {
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
    .then(([newComment]) => newComment);
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

function fetchArticles(sort_by, order, author, topic) {
  const arr = [undefined, "asc", "desc"];
  if (!arr.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (author) {
    return connection
      .select("*")
      .from("users")
      .where("username", "=", author)
      .then(user => {
        if (user.length === 0)
          return Promise.reject({ status: 400, msg: "Bad request" });
        else {
          return connection("article")
            .select("article.*")
            .count({ comment_count: "comments.comment_id" })
            .from("article")
            .leftJoin("comments", "comments.article_id", "article.article_id")
            .groupBy("article.article_id")
            .orderBy(sort_by || "created_at", order || "desc")
            .modify(query => {
              if (author) query.where("article.author", "=", author);
              if (topic) query.where("article.topic", "=", topic);
            })
            .returning("*");
        }
      });
  }
  if (topic) {
    return connection
      .select("*")
      .from("topics")
      .where("slug", "=", topic)
      .then(topics => {
        if (topics.length < 1)
          return Promise.reject({ status: 400, msg: "Bad request" });
        else {
          return connection("article")
            .select("article.*")
            .count({ comment_count: "comments.comment_id" })
            .from("article")
            .leftJoin("comments", "comments.article_id", "article.article_id")
            .groupBy("article.article_id")
            .orderBy(sort_by || "created_at", order || "desc")
            .modify(query => {
              if (author) query.where("article.author", "=", author);
              if (topic) query.where("article.topic", "=", topic);
            })
            .returning("*");
        }
      });
  }

  return connection("article")
    .select("article.*")
    .count({ comment_count: "comments.comment_id" })
    .from("article")
    .leftJoin("comments", "comments.article_id", "article.article_id")
    .groupBy("article.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) query.where("article.author", "=", author);
      if (topic) query.where("article.topic", "=", topic);
    })
    .returning("*");
}

module.exports = {
  fetchArticlesByID,
  changedVote,
  updateComment,
  fetchCommentByID,
  fetchArticles
};

//add another test to check if both are present - topic && author
