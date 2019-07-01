const JSONData = require("../endpoints.json");

function getJSON(req, res, next) {
  res.status(200).send({ JSONData });
}

module.exports = getJSON;
