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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";
import { TaskListSchema } from "@/schema/TaskSchema";

interface TodoTeamFormProps extends React.HTMLAttributes<HTMLDivElement> {
  submitFn: () => void;
}

export function TodoTeamForm({
  submitFn,
  className,
  ...props
}: TodoTeamFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [username] = useUserStore((state) => [state.username]);

  const form = useForm<z.infer<typeof TaskListSchema>>({
    resolver: zodResolver(TaskListSchema),
    defaultValues: {
      name: "",
      username,
    },
  });

  async function onSubmit(data: z.infer<typeof TaskListSchema>) {
    startTransition(async () => {
      try {
        fetch("/api/teamLists", {
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.status === 201) {
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
