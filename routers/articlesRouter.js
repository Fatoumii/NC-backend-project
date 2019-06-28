const articlesRouter = require("express").Router();
const {
  getArticlesById,
  updateArticles,
  postComment,
  getCommentByID,
  getArticles
} = require("../controller/articlesController");
const { handle405Errors } = require("../errors/index");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(updateArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentByID);

module.exports = articlesRouter;
