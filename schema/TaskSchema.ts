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

export const TaskSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please input name.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
  isComplete: z.boolean(),
  note: z
    .string()
    .min(1, {
      message: "Please input note.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
  priority: z
    .number()
    .min(1, { message: "Please input valid value." })
    .max(5, { message: "Please input valid value." }),
  type: z.object({
    isList: z.boolean(),
    value: z.number().min(1, {
      message: "Please input value",
    }),
  }),
  username: z.string(),
});

export const TaskCompleteSchema = z.object({
  isComplete: z.boolean(),
});

export const TaskOrderSchema = z.array(
  z.object({
    id: z.number(),
    orderNo: z.number(),
  })
);

export const TeamMemberSchema = z.object({
  memberIds: z.array(z.number()),
});
