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

export function PrioritySelect({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  console.log(value);
  return (
    <Select
      defaultValue={value.toString()}
      onValueChange={(value) => {
        setValue(parseInt(value));
      }}
    >
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
