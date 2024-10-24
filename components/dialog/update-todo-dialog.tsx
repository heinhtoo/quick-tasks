/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-13
 *
 * Purpose:
 *   Update dialog for todo
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
import { TodoForm } from "../forms/todo-form";

export function UpdateTodoDialog() {
  const [updateId, task, setUpdateId, setRefresh, setTask] = useTodoStore(
    (state) => [
      state.updateId,
      state.task,
      state.setUpdateId,
      state.setRefresh,
      state.setTask,
    ]
  );
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
          <AlertDialogTitle>Update task</AlertDialogTitle>
        </AlertDialogHeader>
        <TodoForm
          task={task}
          updateId={updateId}
          submitFn={() => {
            setUpdateId(null);
            setTask(null);
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
