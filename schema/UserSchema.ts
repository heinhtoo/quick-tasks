import { z } from "zod";

export const UserFormSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please input username.",
    })
    .max(200, {
      message: "Please input less than 200 characters.",
    }),
});
