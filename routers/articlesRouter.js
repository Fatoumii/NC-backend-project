const articlesRouter = require("express").Router();
const { getArticles } = require("../controller/articlesController");

articlesRouter.route("/:article_id").get(getArticles);

module.exports = articlesRouter;
