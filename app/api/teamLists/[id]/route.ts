import { getCurrentUserId } from "@/lib/databaseHelper";
import { createConnection } from "@/lib/mysqldb";
import { TeamMemberSchema } from "@/schema/TaskSchema";
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
    const formData = TeamMemberSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    for (let i = 0; i < formData.data.memberIds.length; i++) {
      const query =
        "INSERT IGNORE INTO TeamMembers (teamId, userId) VALUES (?, ?)";
      await connection.execute(query, [id, formData.data.memberIds[i]]);
    }

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
