const { fetchTopics } = require("../models/topicsModels");

function getTopics(req, res, next) {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
}
module.exports = { getTopics };

/*
{ 
  "topics": [
  {"description": "Code is love, code is life", "slug": "coding"
  }
]
*/
