import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import Navbar from "./Navbar";
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
      <Navbar />
      <main className="lg:ml-60 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
