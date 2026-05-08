import { Link } from "react-router-dom";
import { Building2, Calendar } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const MiniJobCard = ({ job }) => (
  <Link
    to={`/jobs/${job.id}`}
    className="card p-4 hover:border-base-500 transition-all duration-150 block"
  >
    <p className="text-sm font-semibold text-slate-100 leading-snug break-words">
      {job.position}
    </p>
    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
      <Building2 size={12} className="shrink-0" />
      <span className="truncate">{job.company}</span>
    </div>
    {job.applied_date && (
      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
        <Calendar size={11} className="shrink-0" />
        <span>Applied {formatDate(job.applied_date)}</span>
      </div>
    )}
  </Link>
);

export default MiniJobCard;
