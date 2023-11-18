require("dotenv").config({ path: "../.env" });

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
    url: process.env.DATABASE_URL,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
