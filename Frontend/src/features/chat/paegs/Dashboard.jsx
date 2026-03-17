import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";

const Dashboard = () => {
  const auth = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      auth.handlegetMe();
    }
  }, [user, auth.handlegetMe]);

  return <div>Dashboard, {user?.username}</div>;
};

export default Dashboard;
