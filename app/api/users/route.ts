import { createConnection } from "@/lib/mysqldb";
import redisClient from "@/lib/redis";
import { deleteCache, getCache } from "@/lib/redisHelper";
import { UserFormSchema } from "@/schema/UserSchema";
import { NextResponse } from "next/server";

const cacheMainKey = "users";

export async function GET() {
  const data = await getCache(cacheMainKey);
  if (data) {
    return NextResponse.json(data);
  }

  const connection = await createConnection();

  try {
    const query = "SELECT id, username FROM Users";
    const [tasks] = await connection.query(query);
    await redisClient.set(cacheMainKey, JSON.stringify(tasks));

    return NextResponse.json(tasks);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const connection = await createConnection();

  try {
    const data = await request.json();
    const formData = UserFormSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const query = "INSERT IGNORE INTO Users (username) VALUES (?)";
    await connection.execute(query, [formData.data.username]);
    await deleteCache(cacheMainKey);

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
