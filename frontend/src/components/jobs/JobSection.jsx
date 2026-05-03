import { Link } from "react-router-dom";
import { MapPin, Building2, Pencil, Calendar } from "lucide-react";
import { JOB_STATUSES, JOB_TYPES } from "../../utils/constants";
import { formatSalary, formatDate } from "../../utils/formatters";

const JobCard = ({ job, onEdit }) => (
  <Link
    to={`/jobs/${job.id}`}
    className="card p-5 hover:border-base-500 transition-all duration-150 group flex flex-col"
  >
    {/* TOP CONTENT — grows to fill available space */}
    <div className="flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-slate-100 leading-snug break-words">
            {job.position}
          </p>
          <div className="flex items-start gap-1.5 mt-2 text-sm text-slate-300">
            <Building2 size={13} className="text-slate-400 mt-1 shrink-0" />
            <span className="font-medium break-words min-w-0">
              {job.company}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(job);
          }}
          className="text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 p-2 rounded-md transition-colors shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
          aria-label={`Edit ${job.position}`}
        >
          <Pencil size={14} />
        </button>
      </div>

      {job.location && (
        <div className="flex items-start gap-1.5 mt-2 text-sm text-slate-400">
          <MapPin size={13} className="mt-1 shrink-0" />
          <span className="break-words min-w-0">{job.location}</span>
        </div>
      )}
    </div>

    {/* FOOTER — always pinned at the bottom of the card */}
    <div className="mt-4 pt-4 border-t border-base-600 space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        {job.job_type && (
          <span
            className={`text-sm font-medium ${JOB_TYPES[job.job_type]?.color}`}
          >
            {JOB_TYPES[job.job_type]?.label}
          </span>
        )}
        {formatSalary(job.salary_min, job.salary_max) && (
          <span className="text-sm text-emerald-400 font-medium whitespace-nowrap">
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar size={11} className="shrink-0" />
        {job.applied_date ? (
          <span>Applied on {formatDate(job.applied_date)}</span>
        ) : (
          <span>No applied date information</span>
        )}
      </div>
    </div>
  </Link>
);

const JobSection = ({ statusId, jobs, onEdit }) => {
  const config = JOB_STATUSES[statusId];

  if (jobs.length === 0) return null;

  const dotColor = config.color.includes("amber")
    ? "bg-amber-400"
    : config.color.includes("blue")
      ? "bg-blue-400"
      : config.color.includes("emerald")
        ? "bg-emerald-400"
        : config.color.includes("red")
          ? "bg-red-400"
          : "bg-slate-400";

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <h2 className="font-display font-semibold text-slate-200">
          {config.label}
        </h2>
        <span className="text-xs bg-base-700 text-slate-400 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      {/* Grid: 1 → 2 → 3 columns. To give cards more breathing room */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
};

export default JobSection;
