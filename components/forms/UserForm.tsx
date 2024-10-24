/**
 * Author: Hein Htoo
 * Created Date: 2024-10-23
 * Jira Ticket: QTS-7
 *
 * Purpose:
 *   Username form
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
import { UserFormSchema } from "@/schema/UserSchema";
import { Icons } from "../ui/icons";
import { useUserStore } from "../stores/user-store";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, startTransition] = useTransition();
  const [setUsername] = useUserStore((state) => [state.setUsername]);

  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(data: z.infer<typeof UserFormSchema>) {
    startTransition(async () => {
      try {
        fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.status === 201) {
            setUsername(data.username);
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-1">
                    <Label htmlFor="username" className="text-lg">
                      Username
                    </Label>
                    <Input
                      placeholder="john"
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
