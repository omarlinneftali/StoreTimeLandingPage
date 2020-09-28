const path = require("path");
const node_env = require("./node_env.js");

const DBConnection = require(path.join(__dirname, "DBConnection"));
const ENV = process.env.NODE_END || "DEVELOPMENT";

const PORT = node_env[ENV].PORT;

const config = { port: PORT, connectionConfig: DBConnection };

module.exports = config;
