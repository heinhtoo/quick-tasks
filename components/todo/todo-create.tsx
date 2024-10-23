"use client";
import { CommandIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { TodoListComboBox } from "./todo-list-combobox";
import { PrioritySelect } from "./priority-select";
import { Textarea } from "../ui/textarea";

type TodoCreateComponentProps = React.HTMLAttributes<HTMLDivElement>;

function TodoCreateComponent({
  className,
  ...props
}: TodoCreateComponentProps) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl or Command key is pressed along with 'l'
      if ((event.ctrlKey || event.metaKey) && event.key === "x") {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        setOpen(true);
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "my-3 flex flex-row items-center justify-between",
            className
          )}
          {...props}
        >
          <div className="flex flex-row items-center">
            <Plus className="size-4 mr-2" />
            Create New Task
          </div>
          <div className="flex flex-row items-center text-sm text-gray-400">
            <CommandIcon className="size-4 mr-1.5" />X
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[80vw] sm:w-[400px] p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-5">
            <Checkbox className="absolute left-6" />
            <Input className="pl-9" placeholder="Create new task" />
          </div>
          <div className="flex flex-row items-center gap-3">
            <TodoListComboBox />
            <PrioritySelect />
          </div>
          <Textarea className="min-h-[200px] resize-none" />
        </div>
        <Button className="my-3 w-full">Save Changes</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodoCreateComponent;
