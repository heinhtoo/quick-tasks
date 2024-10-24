import React from "react";
import { useNavStore } from "../stores/nav-store";
import { Button } from "../ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import TodoList from "./todo-list";

function TodoListButton() {
  const [isOpen, toggleOpen] = useNavStore((state) => [
    state.isOpen,
    state.toggleOpen,
  ]);
  return (
    <>
      <Button
        variant={"ghost"}
        className="hidden sm:flex"
        size={"icon"}
        onClick={() => {
          toggleOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <Minimize2 className="size-4" />
        ) : (
          <Maximize2 className="size-4" />
        )}
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            className="flex sm:hidden"
            size={"icon"}
            onClick={() => {
              toggleOpen(true);
            }}
          >
            {isOpen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <TodoList />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default TodoListButton;
