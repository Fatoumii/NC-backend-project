const { fetchUsers } = require("../models/usersModels");

function getUsers(req, res, next) {
  const { username } = req.params;
  console.log(username);
  fetchUsers(username)
    .then(([userObj]) => {
      res.status(200).send({ user: userObj });
    })
    .catch(next);
}

module.exports = getUsers;
