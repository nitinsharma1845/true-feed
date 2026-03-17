import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be of 10 character")
    .max(300, "Message exceed to limit of 300 charcter"),
});
