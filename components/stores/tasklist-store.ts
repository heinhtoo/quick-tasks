import { TaskListSchema } from "@/schema/TaskSchema";
import { z } from "zod";
import { create } from "zustand";

interface TodoListState {
  taskList: z.infer<typeof TaskListSchema> | null;
  updateId: number | null;
  setUpdateId: (updateId: number | null) => void;
  setTaskList: (task: z.infer<typeof TaskListSchema> | null) => void;
}

export const useTodoListStore = create<TodoListState>((set) => ({
  taskList: null,
  updateId: null,
  setUpdateId: (updateId: number | null) => {
    set({ updateId });
  },
  setTaskList: (taskList: z.infer<typeof TaskListSchema> | null) => {
    set({ taskList });
  },
}));
