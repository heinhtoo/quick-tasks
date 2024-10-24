import { TeamListSchema } from "@/schema/TaskSchema";
import { z } from "zod";
import { create } from "zustand";

interface TeamListState {
  team: z.infer<typeof TeamListSchema> | null;
  updateId: number | null;
  memberUpdateId: number | null;
  memberIds: number[];
  setMemberIds: (members: number[]) => void;
  setMemberUpdateId: (memberUpdateId: number | null) => void;
  setUpdateId: (updateId: number | null) => void;
  setTeam: (team: z.infer<typeof TeamListSchema> | null) => void;
}

export const useTeamStore = create<TeamListState>((set) => ({
  team: null,
  updateId: null,
  memberUpdateId: null,
  memberIds: [],
  setMemberIds: (memberIds: number[]) => {
    set({ memberIds });
  },
  setMemberUpdateId: (memberUpdateId: number | null) => {
    set({ memberUpdateId });
  },
  setUpdateId: (updateId: number | null) => {
    set({ updateId });
  },
  setTeam: (team: z.infer<typeof TeamListSchema> | null) => {
    set({ team });
  },
}));
