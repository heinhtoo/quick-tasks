import { create } from "zustand";

interface DeleteDialogState {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  deleteFn: () => void;
  setDeleteFn: (deleteFn: () => void) => void;
}

export const useDeleteDialogStore = create<DeleteDialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen: boolean) => {
    set({ isOpen });
  },
  deleteFn: () => {},
  setDeleteFn: (deleteFn: () => void) => {
    set({ deleteFn, isOpen: true });
  },
}));
