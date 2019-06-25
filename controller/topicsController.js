const { fetchTopics } = require("../models/topicsModels");

function getTopics(req, res, next) {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
}
module.exports = { getTopics };

//test topic key?
