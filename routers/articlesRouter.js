const articlesRouter = require("express").Router();
const {
  getArticles,
  updateArticles
} = require("../controller/articlesController");

articlesRouter
  .route("/:article_id")
  .get(getArticles)
  .patch(updateArticles);

module.exports = articlesRouter;
