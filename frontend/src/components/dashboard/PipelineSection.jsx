import MiniJobCard from "./MiniJobCard";

const PipelineSection = ({
  icon: Icon,
  title,
  jobs,
  emptyMessage,
  dotClass,
}) => (
  <section className="card p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <h2 className="font-display font-semibold text-slate-200">{title}</h2>
        <span className="text-xs bg-base-700 text-slate-400 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>
      {Icon && <Icon size={16} className="text-slate-500" />}
    </div>

    {jobs.length === 0 ? (
      <p className="text-sm text-slate-500 italic py-4">{emptyMessage}</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {jobs.map((job) => (
          <MiniJobCard key={job.id} job={job} />
        ))}
      </div>
    )}
  </section>
);

export default PipelineSection;
