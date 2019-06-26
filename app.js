const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const {
  handles500Errors,
  handles404Errors,
  handlesCustomErrors,
  handlePSQL400Errors
} = require("./errors/index");
app.use(express.json());
app.use("/api", apiRouter);

//errors
app.use(handlePSQL400Errors);
app.use(handlesCustomErrors);
app.all("/*", handles404Errors);
app.use(handles500Errors);
module.exports = app;
