/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  dev: {
    driver: "mysql",
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT || 3306,
  },
  // Add other environments like test or production as needed
};
