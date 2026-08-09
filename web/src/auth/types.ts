import { z } from "zod/v4";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  avatarUrl: z.url().optional(),
  provider: z.enum(["google", "github", "microsoft"]),
});

export type User = z.infer<typeof UserSchema>;
