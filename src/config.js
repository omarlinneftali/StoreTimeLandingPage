const path = require("path");
const DBConnection = require(path.join(__dirname, "DBConnection"));

const PORT = process.env.PORT || 50000;

const config = { port: PORT, connectionConfig: DBConnection };

module.exports = config;
