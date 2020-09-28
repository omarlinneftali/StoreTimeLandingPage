const ENV = {
  DEVELOPMENT: {
    PORT: 50000,
    DB_USER: "root",
    DB_PASSWORD: "root",
    DB_NAME: "users",
    DB_HOST: "localhost",
  },
  PRODUCTION: {
    PORT: 50000,
    DB_USER: "omarlin",
    DB_PASSWORD: "Storetime1@",
    DB_NAME: "users",
    DB_HOST: "localhost",
  },
};

module.exports = ENV;
