import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, LayoutGrid, List, Briefcase, Pencil } from "lucide-react";
import { getJobs } from "../services/jobsService";
import { JOB_STATUS_ORDER } from "../utils/constants";
import JobSection from "../components/jobs/JobSection";
import JobFormModal from "../components/jobs/JobFormModal";
import StatusBadge from "../components/shared/StatusBadge";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatDate } from "../utils/formatters";

const Jobs = () => {
  const [view, setView] = useState("cards");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const openAdd = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const goToJob = (id) => navigate(`/jobs/${id}`);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100">
            Jobs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-base-800 border border-base-600 rounded-lg p-1">
            <button
              onClick={() => setView("cards")}
              className={`p-1.5 rounded-md transition-colors ${view === "cards" ? "bg-base-600 text-slate-200" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="Card view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-base-600 text-slate-200" : "text-slate-500 hover:text-slate-300"}`}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
          <button
            onClick={openAdd}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add Job
          </button>
        </div>
      </div>

      {/* Empty state */}
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
        <>
          {/* Card View — sections grouped by status */}
          {view === "cards" && (
            <div className="space-y-8">
              {JOB_STATUS_ORDER.map(({ id }) => (
                <JobSection
                  key={id}
                  statusId={id}
                  jobs={jobs.filter((j) => j.status === id)}
                  onEdit={openEdit}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div className="card overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-base-600">
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-2/5 sm:w-1/4">
                      Position
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-2/5 sm:w-1/4">
                      Company
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-1/5 sm:w-auto">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 hidden md:table-cell">
                      Location
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 hidden lg:table-cell">
                      Applied
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-400 px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-700">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => goToJob(job.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goToJob(job.id);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      className="hover:bg-base-700/50 cursor-pointer transition-colors focus:outline-none focus-visible:bg-base-700/50 focus-visible:ring-1 focus-visible:ring-amber-500/40 focus-visible:ring-inset"
                    >
                      <td className="px-4 py-3">
                        <span
                          className="text-sm font-medium text-slate-200 block truncate"
                          title={job.position}
                        >
                          {job.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm text-slate-400 block truncate"
                          title={job.company}
                        >
                          {job.company}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className="text-sm text-slate-400 block truncate"
                          title={job.location || ""}
                        >
                          {job.location || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400 hidden lg:table-cell whitespace-nowrap">
                        {formatDate(job.applied_date) || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(job);
                          }}
                          className="text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 p-1.5 rounded-md transition-colors"
                          aria-label={`Edit ${job.position}`}
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <JobFormModal isOpen={modalOpen} onClose={closeModal} job={editingJob} />
    </div>
  );
};

export default Jobs;
