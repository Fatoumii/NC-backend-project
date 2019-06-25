exports.handles500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

//controllers

exports.handles404Errors = (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
};
