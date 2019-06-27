process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function fetchUsers(usernameID) {
  return connection
    .select("*")
    .from("users")
    .returning("*");
}
module.exports = { fetchUsers };
// not accessing users by params- emoty obj
