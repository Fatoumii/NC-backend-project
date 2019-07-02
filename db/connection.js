// const knex = require("knex");
// const dbConfig = require("../knexfile");
// const connection = knex(dbConfig);

// module.exports = connection;

const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");
console.log(process.env.DATBASE_URL);

module.exports = knex(dbConfig);
