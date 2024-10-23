import redisClient from "@/lib/redis";
import { NextResponse } from "next/server";

const cacheKey = "lists";

export async function GET() {
  try {
    const value = await redisClient.get(cacheKey);
    if (value) {
      return NextResponse.json(value);
    } else {
      return NextResponse.json([
        { name: "Completed", noOfIncompletedTasks: 10 },
        { name: "Success", noOfIncompletedTasks: 10 },
      ]);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
