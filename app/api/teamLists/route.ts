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
import { TeamListSchema } from "@/schema/TaskSchema";
import { TeamList } from "@/types/teamList";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// Get team lists data
// path: /api/teamLists?username=${username}
// return schema
// {
//    id: number;
//    name: string;
//    noOfIncompletedTasks: number;
// }[];
// if username is not found, return 400 error.
// if username is not exists in database, return 401 error.

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

    const query = `SELECT 
          Teams.id AS teamId, 
          Teams.name AS teamName, 
          Users.id AS userId, 
          Users.username AS username,
          Owners.username As createdBy,
          COUNT(CASE WHEN Tasks.isComplete = 0 THEN 1 END) AS noOfIncompletedTasks
      FROM 
          Teams
      LEFT JOIN 
          Users Owners ON Teams.createdByUserId = Owners.id
      LEFT JOIN 
          TeamMembers ON Teams.id = TeamMembers.teamId
      LEFT JOIN 
          Users ON TeamMembers.userId = Users.id
      LEFT JOIN 
          Tasks ON Tasks.teamId = Teams.id
      WHERE Teams.createdByUserId = ? 
        OR 
          TeamMembers.userId = ?
      GROUP BY 
          Teams.id, Users.id;`;

    const [rows] = await connection.execute<RowDataPacket[]>(query, [
      currentUserId,
      currentUserId,
    ]);

    const teams: TeamList[] = [];

    rows.forEach((row) => {
      if (!teams.find((item) => item.id === row.teamId)) {
        teams.push({
          id: row.teamId,
          name: row.teamName,
          users: [],
          userIds: [],
          noOfIncompletedTasks: row.noOfIncompletedTasks,
          createdBy: row.createdBy,
        });
      }

      // Only add user if exists
      if (row.userId) {
        teams[teams.findIndex((item) => item.id === row.teamId)].users.push(
          row.username
        );
        teams[teams.findIndex((item) => item.id === row.teamId)].userIds.push(
          row.userId
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

// Jira Ticket: QTS-15
// Create team
// path: /api/teamLists
// method: POST
// request schema
// {
//    name: string; // team list name
//    username: string
// }
// return schema
// {
//    message: "Created"
// };
// if username is not found, return 400 error.
// if username is not exists in database, return 401 error.

export async function POST(request: Request) {
  const connection = await createConnection();

  try {
    const data = await request.json();
    const formData = TeamListSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const currentUserId = await getCurrentUserId({
      username: formData.data.username,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

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

// Jira Ticket: QTS-16
// Create team
// path: /api/teamLists?id=${id}
// method: PUT
// request schema
// {
//    name: string; // team name
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
  const connection = await createConnection();

  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const data = await request.json();
    const formData = TeamListSchema.safeParse(data);
    if (!formData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const currentUserId = await getCurrentUserId({
      username: formData.data.username,
    });
    if (!currentUserId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const query = "UPDATE Teams SET name=? WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [
      formData.data.name,
      searchParams.get("id"),
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

// Jira Ticket: QTS-18
// Delete team list
// path: /api/teamLists?id=${id}&username=${username}
// method: DELETE
// return schema
// {
//    message: "Deleted"
// };
// if id is not found in path, return 400 error.
// if username is not found in path, return 400 error.
// if username is not exists in database, return 401 error.

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

    const query = "DELETE FROM Teams WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [searchParams.get("id"), currentUserId]);

    return NextResponse.json({ message: "DELETED" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
