const topicsRouter = require("express").Router();
const { getTopics } = require("../controller/topicsController");
const { handle405Errors } = require("../errors/index");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
