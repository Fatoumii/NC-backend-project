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

    .then(() => {
      const changedTimestamp = formatDate(articleData);
      return knex("article")
        .insert(changedTimestamp)
        .returning("*");
    })
    .then(articleRows => {
      console.log(articleRows);
      /* 
      Your comment data is currently in the incorrect format and will violate your SQL schema. 

      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */

      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
