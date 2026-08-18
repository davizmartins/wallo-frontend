import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token"); // apaga o token
    navigate("/login"); // volta pro login
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">Wall<span>o</span></div>

        <nav className="nav">
          <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
          <NavLink to="/transactions" className="nav-item">Transações</NavLink>
          <NavLink to="/categories" className="nav-item">Categorias</NavLink>
          <NavLink to="/accounts" className="nav-item">Contas</NavLink>
        </nav>

        <button className="logout" onClick={handleLogout}>Sair</button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;