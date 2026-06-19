"use client";

// react
import { createContext, useContext, useMemo, useReducer } from "react";

// types
type AuthUser = {
  userId: string;
  name: string;
  email: string;
  isPremium: boolean;
};

type AuthState = {
  user: AuthUser | null;
};

type LoginAction = {
  type: "LOGIN";
  payload: AuthUser;
};

type LogoutAction = {
  type: "LOGOUT";
};

type AuthAction = LoginAction | LogoutAction;

type AuthContextValue = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

// utils
const readUserDataCookie = (): AuthUser | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("user-data="));

  if (!match) {
    return null;
  }

  const raw = match.substring("user-data=".length);

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as AuthUser;

    if (!parsed.userId || !parsed.name || !parsed.email) {
      return null;
    }

    parsed.isPremium = parsed.isPremium ?? false;

    return parsed;
  } catch {
    return null;
  }
};

// reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

// context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: readUserDataCookie(),
  });

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};

export type { AuthUser };
