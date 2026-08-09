import { z } from "zod";

export const Provider = z.enum(["google", "github", "microsoft"]);
export type Provider = z.infer<typeof Provider>;

export const User = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  avatarUrl: z.url().optional(),
  provider: Provider,
});
export type User = z.infer<typeof User>;
