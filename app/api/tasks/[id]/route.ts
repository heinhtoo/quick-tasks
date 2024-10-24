import { getCurrentUserId } from "@/lib/databaseHelper";
import { createConnection } from "@/lib/mysqldb";
import { TaskSchema } from "@/schema/TaskSchema";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  const id = params.id;
  const connection = await createConnection();

  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    if (!searchParams.get("username")) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }
    const currentUserId = await getCurrentUserId({
      username: searchParams.get("username")!,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }
    const data = await request.json();
    const formData = TaskSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    let query =
      "UPDATE Tasks SET name=?, note=?, priority=?, isComplete=?, taskListId=? WHERE id=? AND createdByUserId=?";
    if (formData.data.type.isList === false) {
      query =
        "UPDATE Tasks SET name=?, note=?, priority=?, isComplete=?, teamId=? WHERE id=? AND createdByUserId=?";
    }

    await connection.execute(query, [
      formData.data.name,
      formData.data.note,
      formData.data.priority,
      formData.data.isComplete,
      formData.data.type.value,
      id,
      currentUserId,
    ]);

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
