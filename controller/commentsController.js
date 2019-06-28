const { changeVotes, removeComment } = require("../models/commentsModels");

function updateComment(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  changeVotes(comment_id, inc_votes)
    .then(([votes]) => {
      res.status(200).send(votes);
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(deleted => {
      res.status(204).send({ msg: "Comment deleted" });
    })
    .catch(next);
}

module.exports = { updateComment, deleteComment };
