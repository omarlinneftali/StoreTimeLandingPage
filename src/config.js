const DBConnection = require("./DBconnection");

const PORT = process.env.PORT || 50000;

const config = { port: PORT, connectionConfig: DBConnection };

module.exports = config;
