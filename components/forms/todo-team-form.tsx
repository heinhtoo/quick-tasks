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
import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";
import { TeamListSchema } from "@/schema/TaskSchema";

interface TodoTeamFormProps extends React.HTMLAttributes<HTMLDivElement> {
  submitFn: () => void;
  team: z.infer<typeof TeamListSchema> | null;
  updateId: number | null;
}

export function TodoTeamForm({
  submitFn,
  className,
  team,
  updateId,
  ...props
}: TodoTeamFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [username] = useUserStore((state) => [state.username]);

  const form = useForm<z.infer<typeof TeamListSchema>>({
    resolver: zodResolver(TeamListSchema),
    defaultValues: {
      name: "",
      username,
    },
  });

  useEffect(() => {
    if (team) {
      form.reset(team);
    } else {
      form.reset({
        name: "",
        username,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, username]);

  async function onSubmit(data: z.infer<typeof TeamListSchema>) {
    startTransition(async () => {
      try {
        if (updateId) {
          fetch("/api/teamLists?id=" + updateId, {
            method: "PUT",
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.ok) {
              submitFn();
            }
          });
        } else {
          fetch("/api/teamLists", {
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
