import type { User } from "./types.ts";

export interface UnauthenticatedState {
  status: "unauthenticated";
}

export interface AuthenticatingState {
  status: "authenticating";
  provider: User["provider"];
}

export interface AuthenticatedState {
  status: "authenticated";
  user: User;
}

export interface ErrorState {
  status: "error";
  message: string;
}

export type State =
  | UnauthenticatedState
  | AuthenticatingState
  | AuthenticatedState
  | ErrorState;

export const initialState: State = { status: "unauthenticated" };
