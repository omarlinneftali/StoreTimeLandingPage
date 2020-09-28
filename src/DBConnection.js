const mysql = require("mysql");
const node_env = require("./node_env.js");

const ENV = process.env.NODE_END || "DEVELOPMENT";

const connectionConfig = {
  host: node_env[ENV].DB_HOST,
  user: node_env[ENV].DB_USER,
  password: node_env[ENV].DB_PASSWORD,
  database: node_env[ENV].DB_NAME,
};

module.exports = connectionConfig;
