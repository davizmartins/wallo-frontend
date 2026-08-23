import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../components/Toast/toast-context";
import { routes } from "../../routes";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const showToast = useToast();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("Preencha todos os campos");
      return;
    }

    try {
      // Cria a conta
      await api.post("/auth/register", { name, email, password });

      showToast("Conta criada com sucesso!", "success");

      // Leva pro login para o usuário entrar
      navigate(routes.login);
    } catch {
      showToast("Erro ao criar conta. O email pode já estar em uso.");
    }
  }

  return (
    <div className="register-page">
      <div className="logo">Wall<span>o</span></div>

      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Criar conta</h2>

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Cadastrar</button>

          <p className="switch-auth">
            Já tem conta? <Link to={routes.login}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;