/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-17
 *
 * Purpose:
 *   Members update form
 *
 */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";
import { TeamMemberSchema } from "@/schema/TaskSchema";
import { MembersComboBox } from "../todo/members-combobox";

interface TodoTeamFormProps extends React.HTMLAttributes<HTMLDivElement> {
  submitFn: () => void;
  members: z.infer<typeof TeamMemberSchema> | null;
  updateId: number;
}

export function TeamMemberForm({
  submitFn,
  members,
  updateId,
  className,
  ...props
}: TodoTeamFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [username] = useUserStore((state) => [state.username]);

  const form = useForm<z.infer<typeof TeamMemberSchema>>({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: {
      memberIds: [],
    },
  });

  useEffect(() => {
    if (members) {
      form.reset(members);
    } else {
      form.reset({
        memberIds: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  async function onSubmit(data: z.infer<typeof TeamMemberSchema>) {
    startTransition(async () => {
      try {
        fetch(
          `/api/teamLists/${updateId}?username=` + encodeURIComponent(username),
          {
            method: "PUT",
            body: JSON.stringify(data),
          }
        ).then((response) => {
          if (response.ok) {
            submitFn();
          }
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: (error as Error).message,
        });
      }
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <MembersComboBox
                      value={field.value}
                      setValue={(value) => {
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            size={"lg"}
            className="my-3 w-full"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
