const {
  fetchArticlesByID,
  changedVote,
  updateComment,
  fetchCommentByID,
  fetchArticles
} = require("../models/articlesModels");

function getArticlesById(req, res, next) {
  fetchArticlesByID(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function updateArticles(req, res, next) {
  if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Bad request" });
  }
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  changedVote(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send(article);
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { body, username } = req.body;
  updateComment(article_id, body, username)
    .then(comment => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
}

function getCommentByID(req, res, next) {
  const { sort_by, order } = req.query;
  const { article_id } = req.params;
  fetchCommentByID(sort_by, order, article_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  const { sort_by, order, author, topic } = req.query;
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
}

module.exports = {
  getArticlesById,
  updateArticles,
  postComment,
  getCommentByID,
  getArticles
};

//sort by - references which column to sort
//order - ASC/DESC
