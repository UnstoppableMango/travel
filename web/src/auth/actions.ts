import type { User } from "./types.ts";
import type { State } from "./state.ts";

export interface LoginAction {
  type: "LOGIN";
  provider: User["provider"];
}

export interface LoginSuccessAction {
  type: "LOGIN_SUCCESS";
  user: User;
}

export interface LoginFailureAction {
  type: "LOGIN_FAILURE";
  message: string;
}

export interface LogoutAction {
  type: "LOGOUT";
}

export type Action =
  | LoginAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;

export function reduce(_state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN":
      return { status: "authenticating", provider: action.provider };
    case "LOGIN_SUCCESS":
      return { status: "authenticated", user: action.user };
    case "LOGIN_FAILURE":
      return { status: "error", message: action.message };
    case "LOGOUT":
      return { status: "unauthenticated" };
    default:
      return _state;
  }
}
