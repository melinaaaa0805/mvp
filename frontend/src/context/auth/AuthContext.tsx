import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../../api/api";

interface User {
  id: string | null;
  email: string | null;
  role: "ADMIN" | "USER";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") as "ADMIN" | "USER";

    if (token && userId) {
      setAuth({
        token,
        user: { id: userId, email, role },
        loading: false,
      });
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, sub, emailUserCo, role } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", sub);
      localStorage.setItem("email", emailUserCo);
      localStorage.setItem("role", role);

      setAuth({
        token: access_token,
        user: { id: sub, email: emailUserCo, role },
        loading: false,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Identifiants invalides" };
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, user: null, loading: false });
  };

  const value = {
    ...auth,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === "ADMIN",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Ton hook useAuth devient simplement une consommation du contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
