const connection = require("../db/connection");

function fetchUsers(username) {
  console.log(username, "username");
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then(user => {
      console.log(user);
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    })
    .then(() => {
      return connection
        .select("*")
        .from("users")
        .where({ username });
    });
}
module.exports = { fetchUsers };
