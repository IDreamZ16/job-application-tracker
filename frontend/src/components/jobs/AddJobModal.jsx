import { useState } from "react";
import Modal from "../shared/Modal";
import { createJob } from "../../services/jobsService";
import { useQueryClient } from "@tanstack/react-query";

const INITIAL = {
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

const AddJobModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

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
      await createJob(payload);
      await queryClient.invalidateQueries(["jobs"]);
      setForm(INITIAL);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Job" size="lg">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Company *</label>
            <input
              className="input"
              placeholder="Shopify"
              value={form.company}
              onChange={set("company")}
              required
            />
          </div>
          <div>
            <label className="label">Position *</label>
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
            placeholder="Any notes about this job..."
            value={form.notes}
            onChange={set("notes")}
          />
        </div>

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
            {loading ? "Adding..." : "Add Job"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;
