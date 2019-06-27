exports.handles422Errors = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(422).send({ msg: "Article ID not found" });
  } else {
    next(err);
  }
};

exports.handlePSQL400Errors = (err, req, res, next) => {
  const codes = ["22P02", "42703"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
}; //not PSQL errors, 404 article not found when passing a number that doesn't exist because it could be there

exports.handles500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

exports.handles404Errors = (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
};

exports.handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
