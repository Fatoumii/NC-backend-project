const {
  fetchArticles,
  changedVote,
  updateComment,
  fetchCommentByID
} = require("../models/articlesModels");

function getArticles(req, res, next) {
  fetchArticles(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function updateArticles(req, res, next) {
  if (Object.keys(req.body).length > 1) {
    res.status(400).send({ msg: "Bad request" });
  }
  const { inc_votes } = req.body; // must deconstructure as it's being fed into increment query which takes a number inc/dec by
  const { article_id } = req.params;
  changedVote(article_id, inc_votes)
    .then(([votes]) => {
      res.status(200).send(votes);
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { body, username } = req.body;
  updateComment(article_id, body, username)
    .then(([newComment]) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
}

function getCommentByID(req, res, next) {
  const { article_id } = req.params;
  fetchCommentByID(article_id).then(comment => {
    res.status(200).send({ comment });
  });
}

module.exports = { getArticles, updateArticles, postComment, getCommentByID };
