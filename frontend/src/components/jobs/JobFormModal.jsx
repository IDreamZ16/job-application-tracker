import { useState, useEffect } from "react";
import Modal from "../shared/Modal";
import { createJob, updateJob } from "../../services/jobsService";
import { useQueryClient } from "@tanstack/react-query";

const EMPTY = {
  company: "",
  position: "",
  status: "saved",
  job_url: "",
  salary_min: "",
  salary_max: "",
  location: "",
  job_type: "",
  description: "",
  notes: "",
  applied_date: "",
};

// Convert a database job (with nulls) into form-friendly strings
const jobToForm = (job) => ({
  company: job.company ?? "",
  position: job.position ?? "",
  status: job.status ?? "saved",
  job_url: job.job_url ?? "",
  salary_min: job.salary_min ?? "",
  salary_max: job.salary_max ?? "",
  location: job.location ?? "",
  job_type: job.job_type ?? "",
  description: job.description ?? "",
  notes: job.notes ?? "",
  applied_date: job.applied_date ? job.applied_date.split("T")[0] : "",
});

const JobFormModal = ({ isOpen, onClose, job = null }) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const isEdit = Boolean(job);

  // Reset/populate form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(job ? jobToForm(job) : EMPTY);
      setError("");
    }
  }, [isOpen, job]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
        job_type: form.job_type || null,
        location: form.location || null,
        applied_date: form.applied_date || null,
      };

      if (isEdit) {
        await updateJob(job.id, payload);
      } else {
        await createJob(payload);
      }

      await queryClient.invalidateQueries(["jobs"]);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to ${isEdit ? "update" : "create"} job`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Job" : "Add New Job"}
      size="lg"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              Company <span className="text-amber-400">*</span>
            </label>
            <input
              className="input"
              placeholder="Shopify"
              value={form.company}
              onChange={set("company")}
              required
            />
          </div>
          <div>
            <label className="label">
              Position <span className="text-amber-400">*</span>
            </label>
            <input
              className="input"
              placeholder="Junior Software Engineer"
              value={form.position}
              onChange={set("position")}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={set("status")}
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="label">Job Type</label>
            <select
              className="input"
              value={form.job_type}
              onChange={set("job_type")}
            >
              <option value="">Not specified</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            className="input"
            placeholder="Vancouver, BC"
            value={form.location}
            onChange={set("location")}
          />
        </div>

        <div>
          <label className="label">Job URL</label>
          <input
            className="input"
            placeholder="https://..."
            value={form.job_url}
            onChange={set("job_url")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Salary Min ($)</label>
            <input
              className="input"
              type="number"
              placeholder="60000"
              value={form.salary_min}
              onChange={set("salary_min")}
            />
          </div>
          <div>
            <label className="label">Salary Max ($)</label>
            <input
              className="input"
              type="number"
              placeholder="80000"
              value={form.salary_max}
              onChange={set("salary_max")}
            />
          </div>
        </div>

        <div>
          <label className="label">Applied Date</label>
          <input
            className="input"
            type="date"
            value={form.applied_date}
            onChange={set("applied_date")}
          />
        </div>

        <div>
          <label className="label">Job Description</label>
          <textarea
            className="input resize-none h-32"
            placeholder="Paste the job posting here (responsibilities, requirements, tech stack...)"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input resize-none h-20"
            placeholder="Your personal notes about this job..."
            value={form.notes}
            onChange={set("notes")}
          />
        </div>

        <p className="text-xs text-slate-500 pt-2">
          Fields marked with <span className="text-amber-400">*</span> are
          required
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading
              ? isEdit
                ? "Saving..."
                : "Adding..."
              : isEdit
                ? "Save Changes"
                : "Add Job"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobFormModal;
