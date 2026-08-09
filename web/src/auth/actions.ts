import type { User } from "./types.ts";
import type { AuthState } from "./state.ts";

export type LoginAction = {
  type: "LOGIN";
  provider: User["provider"];
};

export type LoginSuccessAction = {
  type: "LOGIN_SUCCESS";
  user: User;
};

export type LoginFailureAction = {
  type: "LOGIN_FAILURE";
  message: string;
};

export type LogoutAction = {
  type: "LOGOUT";
};

export type AuthAction =
  | LoginAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;

export function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { status: "authenticating", provider: action.provider };
    case "LOGIN_SUCCESS":
      return { status: "authenticated", user: action.user };
    case "LOGIN_FAILURE":
      return { status: "error", message: action.message };
    case "LOGOUT":
      return { status: "unauthenticated" };
  }
}
