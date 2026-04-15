import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().max(60).nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
