/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-17
 *
 * Purpose:
 *   Members update dialog
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
import { useTeamStore } from "../stores/team-store";
import { TeamMemberForm } from "../forms/team-members-form";

export function TeamUserDialog() {
  const [memberUpdateId, setMemberUpdateId, memberIds, setMemberIds] =
    useTeamStore((state) => [
      state.memberUpdateId,
      state.setMemberUpdateId,
      state.memberIds,
      state.setMemberIds,
    ]);
  const [setRefresh] = useTodoStore((state) => [state.setRefresh]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (memberUpdateId) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [memberUpdateId]);

  if (!memberUpdateId && !memberIds) {
    return <></>;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update members</AlertDialogTitle>
        </AlertDialogHeader>
        <TeamMemberForm
          members={{
            memberIds: memberIds,
          }}
          updateId={memberUpdateId!}
          submitFn={() => {
            setMemberIds([]);
            setMemberUpdateId(null);
            setRefresh(new Date().toISOString());
          }}
        />

        <AlertDialogCancel
          className="w-full"
          onClick={() => {
            setMemberUpdateId(null);
          }}
        >
          Cancel
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
