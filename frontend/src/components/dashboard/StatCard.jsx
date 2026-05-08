const StatCard = ({ label, count, accentClass = "bg-amber-400" }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${accentClass}`} />
      <span className="text-xs uppercase tracking-wider font-medium text-slate-400">
        {label}
      </span>
    </div>
    <p className="font-display text-3xl font-bold text-slate-100 mt-2">
      {count}
    </p>
  </div>
);

export default StatCard;
