import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getJob, deleteJob } from "../services/jobsService";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Modal from "../components/shared/Modal";
import StatusBadge from "../components/shared/StatusBadge";
import JobFormModal from "../components/jobs/JobFormModal";
import ContactsSection from "../components/jobs/ContactsSection";
import ActivitiesSection from "../components/jobs/ActivitiesSection";
import { JOB_TYPES } from "../utils/constants";
import { formatSalary, formatDate } from "../utils/formatters";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    retry: (failureCount, err) => {
      if (err?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.removeQueries({ queryKey: ["job", id] });
      navigate("/jobs", { replace: true });
    },
  });

  const handleEditClose = () => {
    setEditOpen(false);
    // Refresh this job's data after editing — JobFormModal only invalidates ["jobs"]
    queryClient.invalidateQueries({ queryKey: ["job", id] });
  };

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ---------- Error / not found ----------
  if (isError || !job) {
    const notFound = error?.response?.status === 404;
    return (
      <div className="card p-10 max-w-xl mx-auto text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-400" />
        <h2 className="font-display text-2xl font-bold text-slate-100 mt-4">
          {notFound ? "Job not found" : "Something went wrong"}
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {notFound
            ? "This application may have been deleted or never existed."
            : "We couldn't load this job. Try again in a moment."}
        </p>
        <Link
          to="/jobs"
          className="btn-secondary inline-flex items-center gap-2 mt-6"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
      </div>
    );
  }

  // ---------- Loaded ----------
  const jobTypeConfig = job.job_type ? JOB_TYPES[job.job_type] : null;
  const salary = formatSalary(job.salary_min, job.salary_max);
  const appliedDate = job.applied_date ? formatDate(job.applied_date) : null;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="btn-ghost inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="card p-6">
        <h1 className="font-display text-3xl font-bold text-slate-100">
          {job.company}
        </h1>
        <p className="text-lg text-slate-300 mt-1">{job.position}</p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <StatusBadge status={job.status} />
          {jobTypeConfig && (
            <span className={`text-xs font-medium ${jobTypeConfig.color}`}>
              {jobTypeConfig.label}
            </span>
          )}
          {appliedDate && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar size={13} />
              Applied {appliedDate}
            </span>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetaCell icon={MapPin} label="Location" value={job.location} />
        <MetaCell icon={DollarSign} label="Salary">
          {salary ? (
            <span className="text-emerald-400 font-medium">{salary}</span>
          ) : (
            <span className="text-slate-500">Not specified</span>
          )}
        </MetaCell>
        <MetaCell icon={Calendar} label="Applied" value={appliedDate} />
        <MetaCell
          icon={ExternalLink}
          label="Job Posting"
          className="sm:col-span-2 lg:col-span-3"
        >
          {job.job_url ? (
            <a
              href={job.job_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors break-all"
            >
              {job.job_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              <ExternalLink size={13} className="shrink-0" />
            </a>
          ) : (
            <span className="text-slate-500">Not specified</span>
          )}
        </MetaCell>
      </div>

      {/* Job description */}
      {job.description && (
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-slate-200 mb-3">
            Job Description
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      )}

      {/* Personal notes */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-slate-200 mb-3">
          Notes
        </h2>
        {job.notes ? (
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {job.notes}
          </p>
        ) : (
          <p className="text-slate-500 text-sm italic">
            No notes yet. Add interview prep, follow-up reminders, or context
            from the recruiter call.
          </p>
        )}
      </div>

      {/* Contacts */}
      <ContactsSection jobId={id} />

      {/* Activities */}
      <ActivitiesSection jobId={id} />

      {/* Edit modal */}
      <JobFormModal isOpen={editOpen} onClose={handleEditClose} job={job} />

      {/* Delete confirmation */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => {
          if (!deleteMutation.isPending) setConfirmOpen(false);
        }}
        title="Delete this application?"
        size="sm"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10 border border-red-400/20 mb-4">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <p className="text-sm text-slate-400">
          You're about to permanently remove{" "}
          <span className="text-slate-200">{job.position}</span> at{" "}
          <span className="text-slate-200">{job.company}</span>, along with any
          contacts and activities. This can't be undone.
        </p>

        {deleteMutation.error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {deleteMutation.error.response?.data?.error ||
              "Failed to delete. Please try again."}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            disabled={deleteMutation.isPending}
            className="btn-ghost disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            {deleteMutation.isPending ? "Deleting..." : "Delete application"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

const MetaCell = ({ icon: Icon, label, value, children, className = "" }) => (
  <div className={`card p-4 ${className}`}>
    <div className="flex items-center gap-2 text-slate-500 text-xs">
      <Icon size={13} />
      <span className="uppercase tracking-wider font-medium">{label}</span>
    </div>
    <div className="mt-2 text-slate-200 text-sm">
      {children ??
        (value || <span className="text-slate-500">Not specified</span>)}
    </div>
  </div>
);
/* Placeholder for new feature additions */
const Placeholder = ({ icon: Icon, title, description }) => (
  <div className="rounded-xl border-2 border-dashed border-base-600 bg-base-800/40 p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
        <Icon size={16} className="text-amber-400" />
      </div>
      <h3 className="font-display text-base font-semibold text-slate-200">
        {title}
      </h3>
    </div>
    <p className="text-sm text-slate-400 mt-3">{description}</p>
    <p className="text-xs text-slate-500 mt-3 italic">Coming soon</p>
  </div>
);

export default JobDetail;
