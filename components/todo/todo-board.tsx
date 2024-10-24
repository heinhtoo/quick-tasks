"use client";
import React, { useEffect, useState } from "react";
import TodoItem from "./todo-item";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "@/types/taskItem";
import { useQuery } from "react-query";
import { useUserStore } from "../stores/user-store";
import { Skeleton } from "../ui/skeleton";
import { useTodoStore } from "../stores/todo-store";

function TodoBoard() {
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [list, team, refresh] = useTodoStore((state) => [
    state.list,
    state.team,
    state.refresh,
  ]);

  const { data, error, isLoading, refetch } = useQuery<TaskItem[]>(
    ["taskItems", username, list, team, refresh],
    () => {
      const url = "/api/tasks";
      const params = new URLSearchParams({
        username,
      });

      if (list > 0) {
        params.append("list", list.toString());
      }
      if (team) {
        params.append("team", team);
      }

      return fetch(`${url}?${params.toString()}`).then(async (res) => {
        if (res.status === 401) {
          setUsername("");
        }
        if (!res.ok) {
          const errorResponse = await res.json();
          throw new Error(
            errorResponse.error || "An error occcurred while fetching."
          );
        }
        const json = res.json();
        return json;
      });
    }
  );

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const getTaskPos = (id: number) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id === over?.id) {
      return;
    }
    const originalPos = getTaskPos(active.id as number);
    const newPos = getTaskPos(over?.id as number);
    const newArr = arrayMove(tasks, originalPos!, newPos!);
    setTasks(newArr);

    const updateArr = newArr.map((item, index) => {
      return {
        id: item.id,
        orderNo: index,
      };
    });
    fetch("/api/tasks?username=" + encodeURIComponent(username), {
      method: "PUT",
      body: JSON.stringify(updateArr),
    }).then((response) => {
      if (response.ok) {
        refetch();
      }
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col gap-5">
        {data ? (
          tasks.length === 0 ? (
            <div className="flex flex-col gap-3 items-center bg-gray-200 px-10 py-20 rounded-md">
              <span className="text-lg text-center text-gray-500">
                No Tasks
              </span>
            </div>
          ) : (
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((item) => (
                <TodoItem {...item} key={item.id} />
              ))}
            </SortableContext>
          )
        ) : isLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col gap-3 items-center">
            <span className="text-sm text-center text-gray-500">
              {(error as Error).message}
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </DndContext>
  );
}

export default TodoBoard;
