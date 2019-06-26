const { fetchUsers } = require("../models/usersModels");

function getUsers(req, res, next) {
  fetchUsers(req.params)
    .then(([userObj]) => {
      //destructured arr
      res.status(200).send({ user: userObj });
    })
    .catch(next);
}

module.exports = getUsers;
