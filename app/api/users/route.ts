import { createConnection } from "@/lib/mysqldb";
import redisClient from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cacheKey = "users";
    const value = await redisClient.get(cacheKey);
    if (value) {
      return NextResponse.json(value);
    } else {
      const db = await createConnection();
      const sql = "SELECT * FROM Users";
      const [tasks] = await db.query(sql);
      await db.end();
      return NextResponse.json(tasks);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
