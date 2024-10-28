/**
 * Author: Hein Htoo
 * Created Date: 2024-10-23
 * Jira Ticket: QTS-1
 *
 * Purpose:
 *   MySQL connection
 *
 */
import mysql, { createPool } from "mysql2/promise";

const connPool = createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 3,
  maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

let connection: mysql.Connection;
export const createConnection = async () => {
  if (!connection) {
    connection = await connPool.getConnection();
  }
  return connection;
};
