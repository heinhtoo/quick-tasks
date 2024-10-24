/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-16
 *
 * Purpose:
 *   Update team dialog
 *
 */
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTodoStore } from "../stores/todo-store";
import { useEffect, useState } from "react";
import { TodoTeamForm } from "../forms/todo-team-form";
import { useTeamStore } from "../stores/team-store";

export function UpdateTeamDialog() {
  const [updateId, team, setUpdateId, setTeam] = useTeamStore((state) => [
    state.updateId,
    state.team,
    state.setUpdateId,
    state.setTeam,
  ]);
  const [setRefresh] = useTodoStore((state) => [state.setRefresh]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (updateId) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [updateId]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update task list</AlertDialogTitle>
        </AlertDialogHeader>
        <TodoTeamForm
          team={team}
          updateId={updateId}
          submitFn={() => {
            setUpdateId(null);
            setTeam(null);
            setRefresh(new Date().toISOString());
          }}
        />
        <AlertDialogCancel
          className="w-full"
          onClick={() => {
            setUpdateId(null);
          }}
        >
          Cancel
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
