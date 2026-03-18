import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Loader from "./Loader";

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
