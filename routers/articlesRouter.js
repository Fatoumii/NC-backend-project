const articlesRouter = require("express").Router();
const {
  getArticles,
  updateArticles,
  postComment,
  getCommentByID
} = require("../controller/articlesController");

articlesRouter
  .route("/:article_id")
  .get(getArticles)
  .patch(updateArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentByID);

module.exports = articlesRouter;
