const { fetchArticles, changedVote } = require("../models/articlesModels");

function getArticles(req, res, next) {
  fetchArticles(req.params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function updateArticles(req, res, next) {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  changedVote(article_id, inc_votes)
    .then(([votes]) => {
      console.log(votes);
      res.status(200).send(votes);
    })
    .catch(next);
}
module.exports = { getArticles, updateArticles };
