const usersRouter = require("express").Router();
const getUsers = require("../controller/usersController");
const { handle405Errors } = require("../errors/index");

usersRouter
  .route("/:username")
  .get(getUsers)
  .all(handle405Errors);
module.exports = usersRouter;
