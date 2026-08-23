import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../components/Toast/toast-context";
import api from "../../services/api";
import "./Login.css";
import { routes } from "../../routes";

function Login() {
  // "Estado": o React guarda o que o usuário digita nestes campos.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useToast();

  const navigate = useNavigate(); // permite trocar de tela após o login

  // Executado quando o formulário é enviado.
  async function handleSubmit(event) {
    event.preventDefault(); // impede o recarregamento padrão da página

    try {
      // Chama POST /auth/login com email e senha.
      const response = await api.post("/auth/login", { email, password });

      // Guarda o token retornado para as próximas requisições.
      localStorage.setItem("token", response.data.token);

      // Redireciona para o dashboard.
      navigate(routes.dashboard);
    } catch {
      showToast("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-page">
      <div className="logo">Wall<span>o</span></div>

      <div className="container">

        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            name="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            name="Senha"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>
          <p className="switch-auth">
            Não tem conta? <Link to={routes.register}>Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;