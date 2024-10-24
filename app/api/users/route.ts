import { createConnection } from "@/lib/mysqldb";
import { UserFormSchema } from "@/schema/UserSchema";
import { NextResponse } from "next/server";

export async function GET() {
  const connection = await createConnection();

  try {
    const query = "SELECT id, username FROM Users";
    const [tasks] = await connection.query(query);

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

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
