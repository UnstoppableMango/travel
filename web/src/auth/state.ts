import type { User } from "./types.ts";

export type UnauthenticatedState = {
  status: "unauthenticated";
};

export type AuthenticatingState = {
  status: "authenticating";
  provider: User["provider"];
};

export type AuthenticatedState = {
  status: "authenticated";
  user: User;
};

export type AuthErrorState = {
  status: "error";
  message: string;
};

export type AuthState =
  | UnauthenticatedState
  | AuthenticatingState
  | AuthenticatedState
  | AuthErrorState;

export const initialAuthState: AuthState = { status: "unauthenticated" };
