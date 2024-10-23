import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PrioritySelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Priority</SelectLabel>
          <SelectItem value="5">Highest</SelectItem>
          <SelectItem value="4">High</SelectItem>
          <SelectItem value="3">Medium</SelectItem>
          <SelectItem value="2">Low</SelectItem>
          <SelectItem value="1">Lowest</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
