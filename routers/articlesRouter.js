const articlesRouter = require("express").Router();
const {
  getArticlesById,
  updateArticles,
  postComment,
  getCommentByID,
  getArticles
} = require("../controller/articlesController");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(updateArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentByID);

module.exports = articlesRouter;
