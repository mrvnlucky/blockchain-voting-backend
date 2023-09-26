require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: "K1ngd0m123!@#",
    database: "database_development",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: STACKHERO_MYSQL_USER,
    password: STACKHERO_MYSQL_PASSWORD,
    database: STACKHERO_MYSQL_DATABASE,
    host: STACKHERO_MYSQL_HOST,
    dialect: "mysql",
  },
};
