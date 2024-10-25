"use client";

import { DeleteDialog } from "@/components/dialog/delete-dialog";
import { TeamUserDialog } from "@/components/dialog/team-user-dialog";
import { UpdateTeamDialog } from "@/components/dialog/update-team-dialog";
import { UpdateTodoDialog } from "@/components/dialog/update-todo-dialog";
import { UpdateTodoListDialog } from "@/components/dialog/update-todo-list-dialog";
import { UserAuthForm } from "@/components/forms/UserForm";
import { useTodoStore } from "@/components/stores/todo-store";
import { useUserStore } from "@/components/stores/user-store";
import TodoBoard from "@/components/todo/todo-board";
import TodoCreateComponent from "@/components/todo/todo-create";
import TodoList from "@/components/todo/todo-list";
import TodoListButton from "@/components/todo/todo-list-button";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { team: string; list: string };
}) {
  const currentHour = new Date().getHours();
  const [setList, setTeam] = useTodoStore((state) => [
    state.setList,
    state.setTeam,
  ]);
  const [isLoading, username, refetchUsername, setUsername] = useUserStore(
    (state) => [
      state.isLoading,
      state.username,
      state.refetchUsername,
      state.setUsername,
    ]
  );

  useEffect(() => {
    if (searchParams.list) {
      setList(parseInt(searchParams.list));
    } else {
      setList(0);
    }
    if (searchParams.team) {
      setTeam(searchParams.team);
    } else {
      setTeam("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.list, searchParams.team]);

  useEffect(() => {
    if (!username) {
      refetchUsername();
    }
  }, [refetchUsername, username]);

  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  if (username) {
    return (
      <>
        <div className="bg-gray-100 min-h-screen">
          <div className="p-5 sm:py-10">
            <div className="flex flex-row gap-10">
              <div className="hidden sm:flex">
                <TodoList />
              </div>
              <div className="grow flex flex-col gap-5 overflow-hidden">
                <TodoListButton />
                <div className="mx-10">
                  <div className="flex flex-row items-center gap-5 justify-between flex-wrap mb-10">
                    <div className="flex flex-col gap-1.5 w-full sm:w-fit">
                      <h3 className="text-xl sm:text-3xl font-semibold">
                        {currentHour > 18
                          ? "Good Evening"
                          : currentHour > 12
                          ? "Good Afternoon"
                          : "Good Morning"}
                        {", "}
                        {username}
                      </h3>
                      <h4 className="text-sm sm:text-lg text-gray-600">
                        {new Date().toLocaleDateString("en-ca", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          weekday: "short",
                        })}
                      </h4>
                    </div>
                    <Button
                      onClick={() => {
                        setUsername("");
                      }}
                    >
                      Signout
                    </Button>
                  </div>
                  <TodoBoard />
                  <div className="absolute bottom-5 sm:bottom-10">
                    <TodoCreateComponent className="w-[80vw] sm:w-[600px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TeamUserDialog />
        <UpdateTeamDialog />
        <UpdateTodoListDialog />
        <UpdateTodoDialog />
        <DeleteDialog />
      </>
    );
  }

  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">Quick Tasks</h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Enter username and start optimizing your schedule.
            </p>

            <div className="mt-8 flex flex-col items-center">
              <UserAuthForm className="w-80" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
