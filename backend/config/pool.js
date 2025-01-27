const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

module.exports = pool;