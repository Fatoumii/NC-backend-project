const topicsRouter = require("express").Router();
const { getTopics } = require("../controller/topicsController");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
