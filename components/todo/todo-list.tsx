/**
 * Author: Hein Htoo
 * Created Date: 2024-10-24
 * Jira Ticket: QTS-9
 *
 * Purpose:
 *   Todo List
 *
 */
"use client";
import React from "react";
import { useNavStore } from "../stores/nav-store";
import Link from "next/link";
import { Edit, ShieldAlert, Trash, UserPlus } from "lucide-react";
import { useQuery } from "react-query";
import { TaskList } from "@/types/taskList";
import { Skeleton } from "../ui/skeleton";
import { TeamList } from "@/types/teamList";
import TodoListCreate from "./todo-list-create";
import TodoTeamCreate from "./todo-team-create";
import { useUserStore } from "../stores/user-store";
import { useTodoStore } from "../stores/todo-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { buttonVariants } from "../ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import { useDeleteDialogStore } from "../stores/delete-dialog-store";
import { useTodoListStore } from "../stores/tasklist-store";
import { useTeamStore } from "../stores/team-store";

function TodoError({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <ShieldAlert className="size-10" />
      <span className="text-sm text-center text-gray-500">{message}</span>
    </div>
  );
}

function TodoListItem({
  id,
  name,
  noOfIncompletedTasks,
}: {
  id: number;
  name: string;
  noOfIncompletedTasks: number;
}) {
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const [setDeleteFn] = useDeleteDialogStore((state) => [state.setDeleteFn]);
  const [setRefresh] = useTodoStore((state) => [state.setRefresh]);
  const [setTaskList, setUpdateId] = useTodoListStore((state) => [
    state.setTaskList,
    state.setUpdateId,
  ]);
  return (
    <Link
      className="flex flex-row items-center gap-3 justify-between cursor-pointer hover:italic hover:text-primary"
      href={{
        pathname: "/",
        query: {
          list: id,
        },
      }}
    >
      <label>{name}</label>
      <div className="flex flex-row items-center gap-1.5">
        <span className="bg-gray-100 p-1 rounded-md text-sm">
          {noOfIncompletedTasks}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <DotsVerticalIcon className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setUpdateId(id);
                setTaskList({
                  name,
                  username,
                });
              }}
            >
              <Edit className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteFn(() => {
                  fetch(
                    "/api/taskLists?id=" +
                      id +
                      "&username=" +
                      encodeURIComponent(username),
                    {
                      method: "DELETE",
                    }
                  ).then(async (res) => {
                    if (res.status === 401) {
                      setUsername("");
                    }
                    if (res.status === 200) {
                      setRefresh(new Date().toISOString());
                      toast({
                        title: "Success",
                        description: "Deleted successfully.",
                      });
                    } else {
                      const errorResponse = await res.json();
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description:
                          errorResponse.error ||
                          "An error occcurred while fetching.",
                      });
                    }
                  });
                });
              }}
            >
              <Trash className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}

function TodoTeamItem({
  id,
  name,
  users,
  userIds,
  noOfIncompletedTasks,
  createdBy,
}: {
  id: number;
  name: string;
  users: string[];
  userIds: number[];
  noOfIncompletedTasks: number;
  createdBy: string;
}) {
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const [setDeleteFn] = useDeleteDialogStore((state) => [state.setDeleteFn]);
  const [setRefresh] = useTodoStore((state) => [state.setRefresh]);
  const [setTeam, setUpdateId, setMemberIds, setMemberUpdateId] = useTeamStore(
    (state) => [
      state.setTeam,
      state.setUpdateId,
      state.setMemberIds,
      state.setMemberUpdateId,
    ]
  );
  return (
    <Link
      href={{
        pathname: "/",
        query: {
          team: name,
        },
      }}
    >
      <div className="flex flex-col cursor-pointer hover:italic hover:text-primary w-full">
        <div className="bg-gray-100 px-3 py-5 flex flex-row items-center justify-center w-full">
          {users.slice(0, users.length > 3 ? 2 : 3).map((username, index) => (
            <div
              key={username}
              className={`bg-white border size-10 items-center justify-center flex p-3 rounded-full ${
                index === 0 ? "" : "-ml-3"
              }`}
              style={{
                zIndex: 5 - index,
              }}
            >
              {username[0]}
            </div>
          ))}
          {users.length > 3 && (
            <div className="bg-white border size-10 items-center justify-center flex p-3 rounded-full -ml-3">
              +{users.length - 2}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-ellipsis line-clamp-1">{name}</p>
        <div className="flex flex-row items-start gap-3 justify-between">
          <span className="text-xs text-gray-500">
            {noOfIncompletedTasks} Tasks Left
          </span>
          {createdBy === username && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <DotsVerticalIcon className="size-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setMemberIds(userIds);
                    setMemberUpdateId(id);
                  }}
                >
                  <UserPlus className="size-4 mr-2" />
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTeam({
                      name,
                      username,
                    });
                    setUpdateId(id);
                  }}
                >
                  <Edit className="size-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteFn(() => {
                      fetch(
                        "/api/teamLists?id=" +
                          id +
                          "&username=" +
                          encodeURIComponent(username),
                        {
                          method: "DELETE",
                        }
                      ).then(async (res) => {
                        if (res.status === 401) {
                          setUsername("");
                        }
                        if (res.status === 200) {
                          setRefresh(new Date().toISOString());
                          toast({
                            title: "Success",
                            description: "Deleted successfully.",
                          });
                        } else {
                          const errorResponse = await res.json();
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description:
                              errorResponse.error ||
                              "An error occcurred while fetching.",
                          });
                        }
                      });
                    });
                  }}
                >
                  <Trash className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Link>
  );
}

function TodoList() {
  const [username, setUsername] = useUserStore((state) => [
    state.username,
    state.setUsername,
  ]);
  const [refresh] = useTodoStore((state) => [state.refresh]);

  const {
    data: taskLists,
    error: listError,
    isLoading: taskLoading,
    refetch: taskListRefetch,
  } = useQuery<TaskList[]>(["taskLists", username, refresh], () => {
    return fetch(
      "/api/taskLists?username=" + encodeURIComponent(username)
    ).then((res) => {
      if (res.status === 401) {
        setUsername("");
      }
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const json = res.json();
      return json;
    });
  });

  const {
    data: teamLists,
    error: teamError,
    isLoading: teamLoading,
    refetch: teamRefetch,
  } = useQuery<TeamList[]>(["teamLists", username, refresh], () => {
    return fetch(
      "/api/teamLists?username=" + encodeURIComponent(username)
    ).then(async (res) => {
      if (res.status === 401) {
        setUsername("");
      }
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
  const [isOpen] = useNavStore((state) => [state.isOpen]);

  return (
    <div
      className={`${
        isOpen
          ? "flex sm:hidden"
          : "hidden sm:flex bg-white rounded-lg shadow-md w-72 h-[90vh]"
      } flex-col gap-5 p-5`}
    >
      {taskLists ? (
        <>
          <h3 className="font-semibold">Private</h3>
          <div className="flex flex-col gap-3 max-h-[40%] overflow-y-auto">
            {taskLists.map((item) => (
              <TodoListItem {...item} key={item.name} />
            ))}
          </div>
          <TodoListCreate
            refetch={() => {
              taskListRefetch();
            }}
          />
        </>
      ) : taskLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : listError ? (
        <TodoError message={(listError as Error).message} />
      ) : (
        <></>
      )}
      {teamLists ? (
        <>
          <h3 className="font-semibold">Teams</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40%] overflow-y-auto">
            {teamLists.map((item) => (
              <TodoTeamItem {...item} key={item.name} />
            ))}
          </div>
          <TodoTeamCreate
            refetch={() => {
              teamRefetch();
            }}
          />
        </>
      ) : teamLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : teamError ? (
        <TodoError message={(teamError as Error).message} />
      ) : (
        <></>
      )}
    </div>
  );
}

export default TodoList;
