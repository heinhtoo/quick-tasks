"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "react-query";
import { TaskList } from "@/types/taskList";
import { useUserStore } from "../stores/user-store";

export function TodoListComboBox({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const { data: lists } = useQuery<TaskList[]>(["taskLists", username], () => {
    return fetch(
      "/api/taskLists?username=" + encodeURIComponent(username)
    ).then((res) => {
      if (res.status === 401) {
        setUsername("");
      }
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const json = res.json();
      return json;
    });
  });
  const [open, setOpen] = React.useState(false);

  if (!lists) {
    return <></>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? lists.find((item) => item.id === value)?.name : "No list"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search list..." />
          <CommandList>
            <CommandEmpty>No list found.</CommandEmpty>
            <CommandGroup>
              {lists.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id.toString()}
                  onSelect={() => {
                    setValue(item.id);
                    setOpen(false);
                  }}
                  className="flex flex-row items-center justify-between gap-3"
                >
                  <div className="flex flex-row items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </div>
                  <span className="bg-gray-100 p-1 rounded-md text-sm">
                    {item.noOfIncompletedTasks}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
