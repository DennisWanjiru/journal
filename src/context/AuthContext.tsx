import { type User } from "firebase/auth";
import {
  type Dispatch,
  type ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";

type AuthProviderProps = {
  children: ReactNode;
};

interface AuthState {
  currentUser: User | null;
}

type AuthAction = { type: "SIGNIN"; payload: User } | { type: "SIGNOUT" };

const AuthReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "SIGNIN": {
      return {
        currentUser: action.payload,
      };
    }
    case "SIGNOUT": {
      return {
        currentUser: null,
      };
    }
    default:
      return state;
  }
};

const INITIAL_STATE = {
  currentUser: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : null,
};

type AuthContextType = {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
};

export const AuthContext = createContext<AuthContextType>({
  state: INITIAL_STATE,
  dispatch: () => {},
});

export default function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  const value: AuthContextType = {
    state,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
