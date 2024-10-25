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
import redisClient from "@/lib/redis";
import { deleteCache, getCache } from "@/lib/redisHelper";
import { TaskListSchema } from "@/schema/TaskSchema";
import { RowDataPacket } from "mysql2";

import { NextResponse } from "next/server";

const cacheMainKey = "taskLists";

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
    const cacheKey = `${cacheMainKey}:${currentUserId}`;
    const data = await getCache(cacheKey);
    if (data) {
      return NextResponse.json(data);
    } else {
      const query = `SELECT 
          tl.id AS id,
          tl.name AS name,
          COUNT(t.id) AS noOfIncompletedTasks
          FROM 
            TaskLists tl
          LEFT JOIN 
            Tasks t ON tl.id = t.taskListId AND t.isComplete = FALSE
          WHERE 
            tl.createdByUserId = ?
          GROUP BY 
            tl.id, tl.name
          ORDER BY 
            tl.created_at DESC;`;
      const connection = await createConnection();

      const [tasks] = await connection.execute<RowDataPacket[]>(query, [
        currentUserId,
      ]);
      await redisClient.set(cacheKey, JSON.stringify(tasks));

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
  const connection = await createConnection();

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

    const query = "INSERT INTO TaskLists (name, createdByUserId) VALUES (?, ?)";
    await connection.execute(query, [formData.data.name, currentUserId]);
    await deleteCache(cacheMainKey, currentUserId.toString());

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
  const connection = await createConnection();

  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

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

    const query =
      "UPDATE TaskLists SET name=? WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [
      formData.data.name,
      searchParams.get("id"),
      currentUserId,
    ]);
    await deleteCache(cacheMainKey, currentUserId.toString());

    return NextResponse.json({ message: "Updated" }, { status: 200 });
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

    const query = "DELETE FROM TaskLists WHERE id=? AND createdByUserId=?";
    await connection.execute(query, [searchParams.get("id"), currentUserId]);
    await deleteCache(cacheMainKey, currentUserId.toString());

    return NextResponse.json({ message: "DELETED" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  } finally {
    await connection.end;
  }
}
