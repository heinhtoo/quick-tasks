import { RowDataPacket } from "mysql2/promise";
import { createConnection } from "./mysqldb";
import redisClient from "./redis";
const cacheMainKey = "users";

export async function getCurrentUserId({ username }: { username: string }) {
  const cacheKey = `${cacheMainKey}:${username}`;
  const userData = await redisClient.get(cacheKey);
  if (userData) {
    return parseInt(userData);
  } else {
    const connection = await createConnection();

    try {
      const userQuery = `SELECT id FROM Users where username=?`;
      const [rows] = await connection.execute<RowDataPacket[]>(userQuery, [
        username,
      ]);
      if (rows.length > 0) {
        const userData = rows[0];
        await redisClient.set(cacheKey, (userData as { id: number }).id);
        return (userData as { id: number }).id;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
