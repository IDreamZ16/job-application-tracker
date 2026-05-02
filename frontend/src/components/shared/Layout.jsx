import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-base-950">
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
