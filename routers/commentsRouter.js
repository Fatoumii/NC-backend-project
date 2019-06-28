const commentsRouter = require("express").Router();
const { handle405Errors } = require("../errors/index");
const {
  updateComment,
  deleteComment
} = require("../controller/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(updateComment)
  .delete(deleteComment)
  .all(handle405Errors);

module.exports = commentsRouter;
