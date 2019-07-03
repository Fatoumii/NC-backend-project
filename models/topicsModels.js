const connection = require("../db/connection");

function fetchTopics() {
  return connection.select("*").from("topics");
}

module.exports = { fetchTopics };
