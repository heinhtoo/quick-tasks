/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-12
 *
 * Purpose:
 *   Todo create component
 *
 */
"use client";
import { CommandIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TodoForm } from "../forms/todo-form";
import { useTodoStore } from "../stores/todo-store";

type TodoCreateComponentProps = React.HTMLAttributes<HTMLDivElement>;

function TodoCreateComponent({
  className,
  ...props
}: TodoCreateComponentProps) {
  const [isOpen, setOpen] = useState(false);
  const [setRefresh] = useTodoStore((state) => [state.setRefresh]);

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
      <DropdownMenuContent className="w-[80vw] sm:w-[600px] p-3">
        <TodoForm
          task={null}
          updateId={null}
          submitFn={() => {
            setOpen(false);
            setRefresh(new Date().toISOString());
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodoCreateComponent;
