"use client";
import { CommandIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

function TodoTeamCreate() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl or Command key is pressed along with 'l'
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
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
            Create new team
          </div>
          <div className="flex flex-row items-center text-sm text-gray-400">
            <CommandIcon className="size-4 mr-1.5" />B
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new team</DrawerTitle>
          <DrawerDescription>
            Organize, track, and streamline task management for efficient
            project completion.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default TodoTeamCreate;
