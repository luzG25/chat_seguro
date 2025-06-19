import React, { useState } from "react";
import { register } from "../services/authService";

interface RegisterFormProps {
  onRegister: (message: any) => void;
  onLoginClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onLoginClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("LEIT");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@uta.cv")) {
      setError("Por favor, use um email @uta.cv");
      return;
    }
    onRegister(register(email, password, name, course));
  };

  return (
    <div className="auth-form">
      <h2>Registro</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email (@uta.cv):</label>
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
        <div className="form-group">
          <label>Nome Completo:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Registrar</button>
        <button type="button" onClick={onLoginClick} className="secondary">
          Já tenho uma conta
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
