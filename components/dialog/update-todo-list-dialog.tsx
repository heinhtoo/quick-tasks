/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-11
 *
 * Purpose:
 *   Update dialog for todo list
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
import { useTodoListStore } from "../stores/tasklist-store";
import { TodoListForm } from "../forms/todo-list-form";

export function UpdateTodoListDialog() {
  const [updateId, taskList, setUpdateId, setTaskList] = useTodoListStore(
    (state) => [
      state.updateId,
      state.taskList,
      state.setUpdateId,
      state.setTaskList,
    ]
  );
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
        <TodoListForm
          list={taskList}
          updateId={updateId}
          submitFn={() => {
            setUpdateId(null);
            setTaskList(null);
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
