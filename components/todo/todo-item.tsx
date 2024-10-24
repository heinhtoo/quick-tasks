import { TaskItem } from "@/types/taskItem";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Button, buttonVariants } from "../ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Edit, GripIcon, Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDeleteDialogStore } from "../stores/delete-dialog-store";
import { useUserStore } from "../stores/user-store";
import { toast } from "@/hooks/use-toast";
import { useTodoStore } from "../stores/todo-store";
import { Badge } from "../ui/badge";

function TodoItem({
  id,
  name,
  priority,
  note,
  taskListId,
  teamId,
  isComplete,
  createdBy,
  listName,
  teamName,
}: TaskItem) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const [setUpdateId, setTask, setRefresh] = useTodoStore((state) => [
    state.setUpdateId,
    state.setTask,
    state.setRefresh,
  ]);
  const [setDeleteFn] = useDeleteDialogStore((state) => [state.setDeleteFn]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={cn(
        `bg-white px-3 py-1 flex flex-row items-center gap-5 rounded-md justify-between border-l-8`,
        priority === 5
          ? "border-red-500"
          : priority === 4
          ? "border-orange-400"
          : priority === 3
          ? "border-yellow-300"
          : priority === 2
          ? "border-emerald-200"
          : "border-green-100"
      )}
    >
      <div
        className={cn(
          `flex flex-row items-center flex-wrap gap-3`,
          isComplete ? "line-through" : ""
        )}
      >
        <Checkbox
          disabled={username !== createdBy}
          checked={isComplete}
          onCheckedChange={(value) => {
            fetch(
              `/api/tasks/${id}/complete?username=` +
                encodeURIComponent(username),
              {
                method: "PUT",
                body: JSON.stringify({
                  isComplete: value,
                }),
              }
            ).then((response) => {
              if (response.ok) {
                setRefresh(new Date().toISOString());
              }
            });
          }}
        />
        {name}
        <div className="flex flex-row items-center gap-1.5">
          <Badge
            className={username === createdBy ? "bg-yellow-700" : "bg-zinc-500"}
          >
            {createdBy}
          </Badge>
          {listName && <Badge className="bg-orange-500">{listName}</Badge>}
          {teamName && <Badge className="bg-blue-600">{teamName}</Badge>}
        </div>
      </div>

      <div className="flex flex-row items-center gap-3">
        {username === createdBy && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <DotsVerticalIcon className="size-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setUpdateId(id);
                  setTask({
                    note,
                    isComplete,
                    name,
                    type: {
                      isList: taskListId ? true : false,
                      value: taskListId ? taskListId : teamId ? teamId : 0,
                    },
                    priority,
                    username,
                  });
                }}
              >
                <Edit className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteFn(() => {
                    fetch(
                      "/api/tasks?id=" +
                        id +
                        "&username=" +
                        encodeURIComponent(username),
                      {
                        method: "DELETE",
                      }
                    ).then(async (res) => {
                      if (res.status === 401) {
                        setUsername("");
                      }
                      if (res.status === 200) {
                        setRefresh(new Date().toISOString());
                        toast({
                          title: "Success",
                          description: "Deleted successfully.",
                        });
                      } else {
                        const errorResponse = await res.json();
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description:
                            errorResponse.error ||
                            "An error occcurred while fetching.",
                        });
                      }
                    });
                  });
                }}
              >
                <Trash className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button {...listeners} variant={"ghost"} size={"icon"}>
          <GripIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default TodoItem;
