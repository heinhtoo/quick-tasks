/**
 * Author: Hein Htoo
 * Created Date: 2024-10-23
 * Jira Ticket: QTS-1
 *
 * Purpose:
 *   Get username from local storage
 *
 */
import { create } from "zustand";

interface UserState {
  isLoading: boolean;
  username: string;
  refetchUsername: () => void;
  setUsername: (username: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoading: true,
  username: "",
  refetchUsername: () => {
    set({ isLoading: true });
    const username = localStorage.getItem("username");
    if (username) {
      set({ username, isLoading: false });
      return;
    }
    set({ isLoading: false });
  },
  setUsername: (username: string) => {
    set({ isLoading: true });
    localStorage.setItem("username", username);
    set({ username, isLoading: false });
  },
}));
