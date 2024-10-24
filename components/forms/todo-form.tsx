/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-15
 *
 * Purpose:
 *   Team modify form
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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";
import { TaskSchema } from "@/schema/TaskSchema";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { ListIcon, UsersIcon } from "lucide-react";
import { PrioritySelect } from "../todo/priority-select";
import { TodoListComboBox } from "../todo/todo-list-combobox";
import { TodoTeamComboBox } from "../todo/todo-team-combobox";

interface TodoTeamFormProps extends React.HTMLAttributes<HTMLDivElement> {
  submitFn: () => void;
  task: z.infer<typeof TaskSchema> | null;
  updateId: number | null;
}

export function TodoForm({
  submitFn,
  task,
  updateId,
  className,
  ...props
}: TodoTeamFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [username] = useUserStore((state) => [state.username]);

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      isComplete: false,
      note: "",
      priority: 3,
      type: {
        isList: true,
        value: 0,
      },
      username,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset(task);
    } else {
      form.reset({
        name: "",
        isComplete: false,
        note: "",
        priority: 3,
        type: {
          isList: true,
          value: 0,
        },
        username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  async function onSubmit(data: z.infer<typeof TaskSchema>) {
    startTransition(async () => {
      try {
        if (updateId) {
          fetch(
            `/api/tasks/${updateId}?username=` + encodeURIComponent(username),
            {
              method: "PUT",
              body: JSON.stringify(data),
            }
          ).then((response) => {
            if (response.ok) {
              submitFn();
            }
          });
        } else {
          fetch("/api/tasks?username=" + encodeURIComponent(username), {
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
          <div className="flex flex-col gap-3">
            <div className="relative flex flex-row items-center gap-5">
              <FormField
                control={form.control}
                name="isComplete"
                render={({ field }) => (
                  <FormItem className="absolute left-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      className="pl-9 w-full"
                      placeholder="Create new task"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-start gap-3">
                <FormField
                  control={form.control}
                  name="type.value"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        {form.watch("type.isList") ? (
                          <TodoListComboBox
                            value={field.value}
                            setValue={(value) => {
                              field.onChange(value);
                            }}
                          />
                        ) : (
                          <TodoTeamComboBox
                            value={field.value}
                            setValue={(value) => {
                              field.onChange(value);
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type.isList"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-0.5">
                      <div className="flex flex-row items-center gap-1.5">
                        <Button
                          variant={field.value === true ? "default" : "ghost"}
                          size={"icon"}
                          type="button"
                          onClick={() => {
                            field.onChange(true);
                          }}
                        >
                          <ListIcon className="size-4" />
                        </Button>
                        <Button
                          variant={field.value === false ? "default" : "ghost"}
                          size={"icon"}
                          type="button"
                          onClick={() => {
                            field.onChange(false);
                          }}
                        >
                          <UsersIcon className="size-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0.5">
                    <PrioritySelect
                      value={field.value}
                      setValue={(value) => {
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[200px] resize-none"
                      {...field}
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
