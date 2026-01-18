import { useEffect, useState } from "react";
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

export const useAuth = () => {
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

  // --- NOUVELLE FONCTION LOGIN ---
  const login = async (email: string, password: string) => {
    try {
      // 1. Appel API vers ton backend NestJS
      const response = await api.post("/auth/login", { email, password });
      const { access_token, sub, emailUserCo, role } = response.data;
      console.log("User :", response.data.sub);

      // 2. Stockage dans le localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", sub);
      localStorage.setItem("email", emailUserCo);
      localStorage.setItem("role", role);

      // 3. Mise à jour de l'état
      setAuth({
        token: access_token,
        user: { id: sub, email: emailUserCo, role: role },
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur de connexion", error);
      return { success: false, error: "Identifiants invalides" };
    }
  };

  const logout = () => {
    localStorage.clear(); // Plus radical et propre
    setAuth({
      token: null,
      user: null,
      loading: false,
    });
  };

  const isAuthenticated = !!auth.token;
  const isAdmin = auth.user?.role === "ADMIN";

  return {
    ...auth,
    isAuthenticated,
    isAdmin,
    login, // On exporte la fonction login
    logout,
  };
};
