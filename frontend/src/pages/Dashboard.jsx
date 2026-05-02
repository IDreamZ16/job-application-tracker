import { useAuth } from "../store/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">
          Welcome,{" "}
          <span className="text-amber-400">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Auth is working. Real dashboard coming later.
        </p>
      </div>

      <div className="card p-6 max-w-md">
        <p className="text-sm text-slate-300 mb-1">Logged in as</p>
        <p className="text-slate-100 font-medium">{user?.name}</p>
        <p className="text-sm text-slate-400">{user?.email}</p>
        <button onClick={logout} className="btn-secondary mt-4">
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
