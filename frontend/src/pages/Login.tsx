import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../context/auth/AuthContext";

const Login: React.FC = () =>
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) =>
  {
    e.preventDefault();

    if (!email || !password)
    {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    const result = await auth.login(email, password);

    setIsLoading(false);

    if (result.success)
    {
      navigate("/dashboard");
      return;
    }

    alert(result.error ?? "Échec de la connexion");
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <form className="card" onSubmit={handleLogin}>
        <h2 style={{ textAlign: "center" }}>Connexion</h2>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) =>
          {
            setEmail(e.target.value);
          }}
        />

        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) =>
          {
            setPassword(e.target.value);
          }}
        />

        <button
          type="submit"
          className="primary"
          disabled={isLoading}
          style={{ width: "100%" }}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;
