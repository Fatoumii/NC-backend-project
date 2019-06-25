const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const { handles500Errors, handles404Errors } = require("./errors/index");
app.use(express.json());
app.use("/api", apiRouter);

//errors
app.all("/*", handles404Errors);
app.use(handles500Errors);
module.exports = app;
