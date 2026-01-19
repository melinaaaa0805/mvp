import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../context/auth/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Ajout d'un état de chargement

  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page si utilisé dans un <form>

    if (!email || !password) {
      return alert("Veuillez remplir tous les champs");
    }

    setIsLoading(true);
    try {
      await auth.login(email, password);
      // Si login ne lève pas d'erreur, on redirige
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Échec de la connexion : Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <form className="card" onSubmit={handleLogin}>
        {" "}
        {/* Utilisation d'un <form> */}
        <h2 style={{ textAlign: "center" }}>Connexion</h2>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit" // Type submit pour déclencher onSubmit
          className="primary"
          disabled={isLoading} // Désactive le bouton pendant l'envoi
          style={{ width: "100%" }}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;
