import { useSelector } from "react-redux";


const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return <div>Dashboard, {user?.username}</div>;
};

export default Dashboard;
