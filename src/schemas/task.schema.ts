import z from "zod";

export const taskSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(100).optional(),
  activityId: z.int(),
});

export type typeTaskSchema = z.infer<typeof taskSchema>;
