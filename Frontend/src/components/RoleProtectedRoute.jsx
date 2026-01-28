import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
