/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-9
 *
 * Purpose:
 *   Todo list create component
 *
 */
"use client";
import { CommandIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { TodoListForm } from "../forms/todo-list-form";

function TodoListCreate({ refetch }: { refetch: () => void }) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl or Command key is pressed along with 'l'
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
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
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerTrigger>
        <div
          className={cn(
            buttonVariants(),
            "my-3 flex flex-row items-center justify-between w-full"
          )}
        >
          <div className="flex flex-row items-center">
            <Plus className="size-4 mr-2" />
            Create new list
          </div>
          <div className="flex flex-row items-center text-sm text-gray-400">
            <CommandIcon className="size-4 mr-1.5" />L
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-screen-sm">
        <DrawerHeader>
          <DrawerTitle>Create new list</DrawerTitle>
          <DrawerDescription>
            To make all tasks more organized.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <TodoListForm
            list={null}
            updateId={null}
            submitFn={() => {
              setOpen(false);
              refetch();
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default TodoListCreate;
