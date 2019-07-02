const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })

    .then(() => {
      const topicInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const userInsertions = knex("users")
        .insert(userData)
        .returning("*");
      return Promise.all([topicInsertions, userInsertions]);
    })

    .then(([topics, users]) => {
      const changedTimestamp = formatDate(articleData);
      return knex("article")
        .insert(changedTimestamp)
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
