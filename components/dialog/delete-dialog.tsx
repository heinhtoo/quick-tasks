/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-14, QTS-10, QTS-QTS-18
 *
 * Purpose:
 *   General delete dialog for all.
 *
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDialogStore } from "../stores/delete-dialog-store";

export function DeleteDialog() {
  const [deleteFn, isOpen, setOpen] = useDeleteDialogStore((state) => [
    state.deleteFn,
    state.isOpen,
    state.setOpen,
  ]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteFn();
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
