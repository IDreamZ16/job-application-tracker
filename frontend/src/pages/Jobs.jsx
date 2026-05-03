import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/jobsService";
import AddJobModal from "../components/jobs/AddJobModal";
import StatusBadge from "../components/shared/StatusBadge";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatDate } from "../utils/formatters";

const Jobs = () => {
  const [showAdd, setShowAdd] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100">
            Jobs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Job
        </button>
      </div>

      {/* List View */}
      {jobs.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center gap-3 text-center">
          <Briefcase size={36} className="text-slate-600" />
          <div>
            <p className="text-slate-300 font-medium">No jobs tracked yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Click "Add Job" to track your first application.
            </p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-600">
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Position
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 hidden md:table-cell">
                  Location
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 hidden lg:table-cell">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-700">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-base-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-200">
                      {job.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {job.company}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 hidden md:table-cell">
                    {job.location || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 hidden lg:table-cell">
                    {formatDate(job.applied_date) || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddJobModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
};

export default Jobs;
