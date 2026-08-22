import { Navigate } from "react-router-dom";
import { routes } from "../../routes";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={routes.login} />;
  }
  return children;
}

export default PrivateRoute;