import DashboardClient from "../components/DahboardClient";
import DashboardAdmin from "../components/DashboardAdmin";
import { useAuth } from "../context/auth/useAuth";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!user) {
    return <p>Non autorisé</p>;
  }

  return user.role === "ADMIN" ? <DashboardAdmin /> : <DashboardClient />;
};

export default Dashboard;
