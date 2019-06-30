process.env.NODE_ENV = "test";
const connection = require("../db/connection");

function changeVotes(comment_id, inc_votes = 0) {
  if (inc_votes === 0) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (comment_id > comment_id.length)
    return Promise.reject({ status: 404, msg: "Comment not found" });

  return connection
    .increment("votes", inc_votes)
    .from("comments")
    .where({ comment_id })
    .returning("*");
}

function removeComment(comment_id) {
  return connection("comments")
    .where({ comment_id })
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    })
    .then(() => {
      return connection("comments")
        .where({ comment_id })
        .del();
    });
}

module.exports = { changeVotes, removeComment };
