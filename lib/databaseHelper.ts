import { RowDataPacket } from "mysql2/promise";
import { createConnection } from "./mysqldb";

export async function getCurrentUserId({ username }: { username: string }) {
  const connection = await createConnection();
  const userQuery = `SELECT id FROM Users where username=?`;
  const [rows] = await connection.execute<RowDataPacket[]>(userQuery, [
    username,
  ]);
  if (rows.length > 0) {
    const userData = rows[0];
    return (userData as { id: number }).id;
  } else {
    return null;
  }
}
