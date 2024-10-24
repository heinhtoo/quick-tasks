import { z } from "zod";

export const TaskListSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please input name.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
  username: z
    .string()
    .min(1, {
      message: "Please input username.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
});

export const TeamListSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please input name.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
  username: z
    .string()
    .min(1, {
      message: "Please input username.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
});
