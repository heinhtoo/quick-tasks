/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-9, QT-10, QT-11
 *
 * Purpose:
 *   Api for CURD of task list
 *
 */
import { getCurrentUserId } from "@/lib/databaseHelper";
import { createConnection } from "@/lib/mysqldb";
import { TaskListSchema } from "@/schema/TaskSchema";
import { TeamList } from "@/types/teamList";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Get tasks lists data
// path: /api/taskLists?username=${username}
// return schema
// {
//    id: number;
//    name: string;
//    noOfIncompletedTasks: number;
// }[];
// if username is not found, return 400 error.
// if username is not exists in database, return 401 error.

export async function GET(request: Request) {
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

    const connection = await createConnection();
    const query = `SELECT 
          Teams.id AS teamId, 
          Teams.name AS teamName, 
          Users.id AS userId, 
          Users.username AS username,
          COUNT(CASE WHEN Tasks.isComplete = 0 THEN 1 END) AS noOfIncompletedTasks
      FROM 
          Teams
      LEFT JOIN 
          TeamMembers ON Teams.id = TeamMembers.teamId
      LEFT JOIN 
          Users ON TeamMembers.userId = Users.id
      LEFT JOIN 
          Tasks ON Tasks.taskListId IN (
              SELECT id FROM TaskLists WHERE TaskLists.createdByUserId IN (
                  SELECT Users.id FROM Users WHERE TeamMembers.userId = Users.id
              )
          )
      WHERE Teams.createdByUserId = ?
      GROUP BY 
          Teams.id, Users.id;`;

    const [rows] = await connection.execute<RowDataPacket[]>(query, [
      currentUserId,
    ]);

    const teams: TeamList[] = [];

    rows.forEach((row) => {
      if (!teams.find((item) => item.id === row.teamId)) {
        teams.push({
          id: row.teamId,
          name: row.teamName,
          users: [],
          noOfIncompletedTasks: 0,
        });
      }

      // Only add user if exists
      if (row.userId) {
        teams[teams.findIndex((item) => item.id === row.teamId)].users.push(
          row.username
        );
      }
    });

    return NextResponse.json(teams);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

// Jira Ticket: QTS-9
// Create tasks list
// path: /api/taskLists
// method: POST
// request schema
// {
//    name: string; // task list name
//    username: string
// }
// return schema
// {
//    message: "Created"
// };
// if username is not found, return 400 error.
// if username is not exists in database, return 401 error.

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const formData = TaskListSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const currentUserId = await getCurrentUserId({
      username: formData.data.username,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const connection = await createConnection();

    const query = "INSERT INTO Teams (name, createdByUserId) VALUES (?, ?)";
    const [teamResult] = await connection.execute(query, [
      formData.data.name,
      currentUserId,
    ]);

    const teamId = (teamResult as { insertId: number }).insertId;

    const teamMember = "INSERT INTO TeamMembers (teamId, userId) VALUES (?, ?)";
    await connection.execute(teamMember, [teamId, currentUserId]);

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

// Jira Ticket: QTS-11
// Create tasks list
// path: /api/taskLists?id=${id}
// method: PUT
// request schema
// {
//    name: string; // task list name
//    username: string;
// }
// return schema
// {
//    message: "Updated"
// };
// if id is not found in path, return 400 error.
// if username is not found, return 400 error.
// if username is not exists in database, return 401 error.

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    if (!searchParams.get("username")) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const formData = TaskListSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const currentUserId = await getCurrentUserId({
      username: formData.data.username,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const connection = await createConnection();

    const query = "UPDATE Teams SET name=? WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [
      formData.data.name,
      searchParams.get("id"),
      currentUserId,
    ]);
    revalidatePath("/");

    return NextResponse.json({ message: "Updated" }, { status: 204 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}

// Jira Ticket: QTS-10
// Delete tasks list
// path: /api/taskLists?id=${id}&username=${username}
// method: DELETE
// return schema
// {
//    message: "Deleted"
// };
// if id is not found in path, return 400 error.
// if username is not found in path, return 400 error.
// if username is not exists in database, return 401 error.

export async function DELETE(request: Request) {
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

    const connection = await createConnection();

    const query = "DELETE FROM Teams WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [searchParams.get("id"), currentUserId]);
    revalidatePath("/");

    return NextResponse.json({ message: "DELETED" }, { status: 204 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
