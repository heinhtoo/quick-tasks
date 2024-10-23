import { TaskItem } from "@/types/taskItem";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { buttonVariants } from "../ui/button";
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
import { Edit, List, Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TodoItem({ id, priority, title, isCompleted }: TaskItem) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
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
          `flex flex-row items-center gap-3`,
          isCompleted ? "line-through" : ""
        )}
      >
        <Checkbox checked={isCompleted} />
        {title}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <DotsVerticalIcon className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <List className="size-4 mr-2" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TodoItem;
