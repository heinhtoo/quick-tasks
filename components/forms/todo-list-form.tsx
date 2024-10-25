/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-9
 *
 * Purpose:
 *   Todo list form
 *
 */
"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";
import { TaskListSchema } from "@/schema/TaskSchema";

interface TodoListFormProps extends React.HTMLAttributes<HTMLDivElement> {
  submitFn: () => void;
  list: z.infer<typeof TaskListSchema> | null;
  updateId: number | null;
}

export function TodoListForm({
  submitFn,
  list,
  updateId,
  className,
  ...props
}: TodoListFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [username] = useUserStore((state) => [state.username]);

  const form = useForm<z.infer<typeof TaskListSchema>>({
    resolver: zodResolver(TaskListSchema),
    defaultValues: {
      name: "",
      username,
    },
  });

  useEffect(() => {
    if (list) {
      form.reset(list);
    } else {
      form.reset({
        name: "",
        username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, username]);

  async function onSubmit(data: z.infer<typeof TaskListSchema>) {
    startTransition(async () => {
      try {
        if (updateId) {
          fetch("/api/taskLists?id=" + updateId, {
            method: "PUT",
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.ok) {
              submitFn();
            }
          });
        } else {
          fetch("/api/taskLists", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.status === 201) {
              submitFn();
            }
          });
        }
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
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-1">
                    <Label htmlFor="name" className="text-lg">
                      Name
                    </Label>
                    <Input
                      placeholder="List name"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" size={"lg"}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
