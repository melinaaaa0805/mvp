import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../../api/api";

interface User
{
  id: string | null;
  email: string | null;
  role: "ADMIN" | "USER";
}

interface AuthState
{
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState
{
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) =>
{
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() =>
  {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") as "ADMIN" | "USER";

    if (token && userId)
    {
      setAuth({
        token,
        user: { id: userId, email, role },
        loading: false,
      });
    }
    else
    {
      setAuth((previousAuthState) =>
      {
        return { ...previousAuthState, loading: false };
      });
    }
  }, []);

  const login = async (email: string, password: string) =>
  {
    try
    {
      const response = await api.post("/auth/login", { email, password });

      // Backend (Nest) renvoie : { access_token, sub, email, role }
      const { access_token, sub, email: returnedEmail, role } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", sub);
      localStorage.setItem("email", returnedEmail);
      localStorage.setItem("role", role);

      setAuth({
        token: access_token,
        user: { id: sub, email: returnedEmail, role },
        loading: false,
      });

      return { success: true };
    }
    catch (error: unknown)
    {
      const anyError = error as {
        response?: { data?: { message?: string | string[] } };
      };

      const apiMessage = anyError?.response?.data?.message;

      const message = Array.isArray(apiMessage)
        ? apiMessage.join(", ")
        : apiMessage;

      return { success: false, error: message ?? "Identifiants invalides" };
    }
  };

  const logout = () =>
  {
    localStorage.clear();
    setAuth({ token: null, user: null, loading: false });
  };

  const value: AuthContextType = {
    ...auth,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === "ADMIN",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () =>
{
  const context = useContext(AuthContext);

  if (!context)
  {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
};
