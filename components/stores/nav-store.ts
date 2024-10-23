/**
 * Author: Hein Htoo
 * Created Date: 2024-10-23
 * Jira Ticket: QTS-1
 *
 * Purpose:
 *   Hide and show navigation links
 *
 * Important Notes:
 *   - Any important notes
 */
import { create } from "zustand";

interface NavState {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  isOpen: true,
  toggleOpen: (isOpen: boolean) => {
    set({ isOpen });
  },
}));
