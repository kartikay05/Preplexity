import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Loader from "./Loader";

const Public = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Public;
