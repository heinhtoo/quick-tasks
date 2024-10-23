import { createConnection } from "@/lib/mysqldb";
import redisClient from "@/lib/redis";
import { UserFormSchema } from "@/schema/UserSchema";
import { NextResponse } from "next/server";

const cacheKey = "users";

export async function GET() {
  try {
    const value = await redisClient.get(cacheKey);
    if (value) {
      return NextResponse.json(value);
    } else {
      const connection = await createConnection();
      const query = "SELECT * FROM Users";
      const [tasks] = await connection.query(query);
      await connection.end();
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const formData = UserFormSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const connection = await createConnection();
    const query = "INSERT INTO Users (username) VALUES (?)";
    await connection.execute(query, [formData.data.username]);
    await connection.end();

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
