import {
  createContext,
  type ReactNode,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import AppReducer from "./AppReducer";
import type { TAuthor, TState } from "../types";

const initialState: TState = {
  articles: [],
  error: "",
  loading: true,
  user: {} as TAuthor,
  getArticles: () => Promise.resolve(),
  setUser: () => ({}),
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  const getArticles = useCallback(async (page = 1, limit = 20) => {
    try {
      const res = await axios.get(`/api/v1/articles?page=${page}&limit=${limit}`);
      dispatch({ type: "GET_ARTICLES", payload: res.data.articles });
    } catch (err) {
      dispatch({ type: "API_ERROR", payload: err });
    }
  }, []);

  const setUser = useCallback((user: TAuthor) => {
    localStorage.setItem("hn_token", user.token);
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hn_token");
    if (token && !state.user?._id) {
      axios
        .get("/api/v1/auth/me")
        .then(({ data }) => {
          setUser({ ...data.user, token });
        })
        .catch((e) => console.log(e));
    }
  }, [setUser, state.user?._id]);

  return (
    <AppContext.Provider
      value={{
        articles: state.articles,
        error: state.error,
        loading: state.loading,
        user: state.user,
        getArticles,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("Context should be in StoreProvider");
  }
  return appContext;
};
