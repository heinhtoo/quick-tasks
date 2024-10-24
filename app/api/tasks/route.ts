import { getCurrentUserId } from "@/lib/databaseHelper";
import { createConnection } from "@/lib/mysqldb";
import { TaskOrderSchema, TaskSchema } from "@/schema/TaskSchema";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    const team = searchParams.get("team");
    const list = searchParams.get("list");

    let query = `SELECT 
        Tasks.id, 
        Tasks.name, 
        Tasks.priority,
        Tasks.note, 
        Tasks.isComplete, 
        Tasks.createdByUserId, 
        Tasks.taskListId,
        Users.username as createdBy,
        TaskLists.name as listName,
        Teams.name as teamName
      FROM 
        Tasks
      LEFT JOIN 
          Users ON Tasks.createdByUserId = Users.id
      LEFT JOIN 
          Teams ON Tasks.teamId = Teams.id
      LEFT JOIN
          TeamMembers ON Teams.id = TeamMembers.teamId
      LEFT JOIN 
          TaskLists ON Tasks.taskListId = TaskLists.id      
      WHERE 
        Tasks.createdByUserId = ? 
      OR
        TeamMembers.userId = ?
        `;

    if (team) {
      query += `
      OR 
        EXISTS (
          SELECT 1 
          FROM TeamMembers 
          WHERE TeamMembers.userId = ? 
          AND TeamMembers.teamId = (
            SELECT Teams.id 
            FROM Teams
            JOIN TaskLists ON TaskLists.createdByUserId = TeamMembers.userId
            WHERE TaskLists.id = Tasks.taskListId
          )
        ) 
      `;
    }

    if (list) {
      query += `
      OR 
  Tasks.taskListId = ?`;
    }

    query += ` ORDER BY Tasks.orderNo`;

    const [rows] = await connection.execute<RowDataPacket[]>(
      query,
      team && list
        ? [currentUserId, currentUserId, team, parseInt(list)]
        : team
        ? [currentUserId, currentUserId, team]
        : list
        ? [currentUserId, currentUserId, list]
        : [currentUserId, currentUserId]
    );

    return NextResponse.json(
      rows.map((item) => {
        return { ...item, isComplete: item.isComplete !== 0 };
      })
    );
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
    const formData = TaskSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const currentUserId = await getCurrentUserId({
      username: formData.data.username,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    let query =
      "INSERT INTO Tasks (name, createdByUserId, note, priority, isComplete, taskListId) VALUES (?, ?, ?, ?, ?, ?)";
    if (formData.data.type.isList === false) {
      query =
        "INSERT INTO Tasks (name, createdByUserId, note, priority, isComplete, teamId) VALUES (?, ?, ?, ?, ?, ?)";
    }
    await connection.execute(query, [
      formData.data.name,
      currentUserId,
      formData.data.note,
      formData.data.priority,
      formData.data.isComplete,
      formData.data.type.value,
    ]);

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
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
    const formData = TaskOrderSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    for (let i = 0; i < formData.data.length; i++) {
      const query =
        "UPDATE Tasks SET orderNo=? WHERE id=? AND createdByUserId=?";
      await connection.execute(query, [
        formData.data[i].orderNo,
        formData.data[i].id,
        currentUserId,
      ]);
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

export async function DELETE(request: Request) {
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
    if (!searchParams.get("id")) {
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

    const query = "DELETE FROM Tasks WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [
      parseInt(searchParams.get("id")!),
      currentUserId,
    ]);

    return NextResponse.json({ message: "DELETED" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
