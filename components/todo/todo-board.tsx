"use client";
import React, { useState } from "react";
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

const initialTasks = [
  {
    title: "Wash my face",
    isCompleted: false,
    priority: 5,
    description: "",
    id: 1,
  },
  {
    title: "Buy groceries",
    isCompleted: false,
    priority: 3,
    description: "Buy milk, eggs, and bread",
    id: 2,
  },
  {
    title: "Complete React project",
    isCompleted: false,
    priority: 1,
    description: "Finish the task management app",
    id: 3,
  },
  {
    title: "Go for a run",
    isCompleted: true,
    priority: 4,
    description: "Run 5 kilometers in the park",
    id: 4,
  },
  {
    title: "Read a book",
    isCompleted: false,
    priority: 2,
    description: "Read 20 pages of a new book",
    id: 5,
  },
];

function TodoBoard() {
  const [tasks, setTasks] = useState(initialTasks);

  const getTaskPos = (id: number) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id === over?.id) {
      return;
    }
    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id as number);
      const newPos = getTaskPos(over?.id as number);
      return arrayMove(tasks, originalPos, newPos);
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
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((item) => (
            <TodoItem {...item} key={item.id} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}

export default TodoBoard;
