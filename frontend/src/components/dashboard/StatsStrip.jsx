import { JOB_STATUS_ORDER } from "../../utils/constants";
import StatCard from "./StatCard";

// Map status IDs to their dot color. Keeps the dashboard in sync with colors used elsewhere.
const STATUS_DOTS = {
  saved: "bg-slate-400",
  applied: "bg-blue-400",
  interviewing: "bg-amber-400",
  offer: "bg-emerald-400",
  rejected: "bg-red-400",
};

const StatsStrip = ({ jobs }) => {
  const total = jobs.length;
  const counts = JOB_STATUS_ORDER.map(({ id, label }) => ({
    id,
    label,
    count: jobs.filter((j) => j.status === id).length,
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Total" count={total} accentClass="bg-amber-400" />
      {counts.map(({ id, label, count }) => (
        <StatCard
          key={id}
          label={label}
          count={count}
          accentClass={STATUS_DOTS[id] || "bg-slate-400"}
        />
      ))}
    </div>
  );
};

export default StatsStrip;
