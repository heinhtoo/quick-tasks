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
import { User } from "@/types/user";
import { useUserStore } from "../stores/user-store";

export function MembersComboBox({
  value,
  setValue,
}: {
  value: number[];
  setValue: (value: number[]) => void;
}) {
  const [username] = useUserStore((state) => [state.username]);
  const { data: lists } = useQuery<User[]>(["users"], () => {
    return fetch("/api/users").then(async (res) => {
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(
          errorResponse.error || "An error occcurred while fetching."
        );
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
          {value.length > 3
            ? value.length + " members"
            : value.length <= 3
            ? value
                .map((item) => lists.find((b) => b.id === item)?.username)
                .join(",")
            : value.length === 0 && "No members"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {lists.map((item) => (
                <CommandItem
                  key={item.id}
                  disabled={username === item.username}
                  value={item.id.toString()}
                  onSelect={() => {
                    if (value.includes(item.id)) {
                      setValue(value.filter((s) => s !== item.id));
                    } else {
                      setValue([...value, item.id]);
                    }
                    setOpen(false);
                  }}
                  className="flex flex-row items-center justify-between gap-3"
                >
                  <div className="flex flex-row items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(item.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.username}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
