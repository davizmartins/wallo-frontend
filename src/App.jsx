import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Categories from "./pages/Categories/Categories";
import Layout from "./components/Layout/Layout";
import Accounts from "./pages/Accounts/Accounts";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Transactions from "./pages/Transactions/Transactions";
import Register from "./pages/Register/Register";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      {/* Rota pública: login */}
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.register} element={<Register />} />

      {/* Rotas internas: protegidas e dentro do Layout (com a sidebar) */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.categories} element={<Categories />} />
        <Route path={routes.accounts} element={<Accounts />} />
        <Route path={routes.transactions} element={<Transactions />} />
        {}
      </Route>

      {/* Raiz redireciona pro dashboard */}
      <Route path="/" element={<Navigate to={routes.dashboard} />} />
    </Routes>
  );
}

export default App;