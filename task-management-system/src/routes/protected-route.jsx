import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const hasGroupValue = !!localStorage.getItem("group");

  return hasGroupValue ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
