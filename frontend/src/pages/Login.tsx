import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../context/auth/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      auth.login(email, password);
      navigate("/dashboard");
    } catch {
      alert("Échec de la connexion");
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="card">
        <h2 style={{ textAlign: "center" }}>Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="primary"
          onClick={handleLogin}
          style={{ width: "100%" }}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Login;
