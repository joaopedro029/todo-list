import z from "zod";

export const activitySchema = z.object({
  name: z.string().min(1).max(30),
});

export type dataCreateActivity = z.infer<typeof activitySchema>;
