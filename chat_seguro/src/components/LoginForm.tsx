import React, { useState } from "react";
import { login } from "../services/authService";

interface LoginFormProps {
  onLogin: (message: any) => void;
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@uta.cv")) {
      setError("Por favor, use um email @uta.cv");
      return;
    }
    setIsLoading(true);
    onLogin(login(email, password));
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Carregando..." : "Entrar"}
        </button>
        <button type="button" onClick={onRegisterClick} className="secondary">
          Criar nova conta
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
