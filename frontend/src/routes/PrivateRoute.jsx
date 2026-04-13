import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <section className="gm-placeholder-page">LOADING...</section>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}