/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-13
 *
 * Purpose:
 *   Manage todo states
 *
 */
import { TaskSchema } from "@/schema/TaskSchema";
import { z } from "zod";
import { create } from "zustand";

interface TodoState {
  list: number;
  team: string;
  refresh: string;
  task: z.infer<typeof TaskSchema> | null;
  updateId: number | null;
  setUpdateId: (updateId: number | null) => void;
  setTask: (task: z.infer<typeof TaskSchema> | null) => void;
  setRefresh: (refresh: string) => void;
  setList: (list: number) => void;
  setTeam: (team: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  list: 0,
  team: "",
  refresh: "",
  task: null,
  updateId: null,
  setUpdateId: (updateId: number | null) => {
    set({ updateId });
  },
  setTask: (task: z.infer<typeof TaskSchema> | null) => {
    set({ task });
  },
  setList: (list: number) => {
    set({ list });
  },
  setTeam: (team: string) => {
    set({ team });
  },
  setRefresh: (refresh: string) => {
    set({ refresh });
  },
}));
