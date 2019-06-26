const { fetchArticles } = require("../models/articlesModels");

function getArticles(req, res, next) {
  fetchArticles(req.params)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

module.exports = { getArticles };
