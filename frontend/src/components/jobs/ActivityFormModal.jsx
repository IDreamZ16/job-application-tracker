import { useState, useEffect } from "react";
import Modal from "../shared/Modal";
import {
  createActivity,
  updateActivity,
} from "../../services/activitiesService";
import { useQueryClient } from "@tanstack/react-query";
import { ACTIVITY_TYPES } from "../../utils/constants";

const today = () => new Date().toISOString().split("T")[0];

const buildEmpty = () => ({
  type: ACTIVITY_TYPES[0].value,
  title: "",
  description: "",
  activity_date: today(),
});

const activityToForm = (activity) => ({
  type: activity.type ?? ACTIVITY_TYPES[0].value,
  title: activity.title ?? "",
  description: activity.description ?? "",
  activity_date: activity.activity_date
    ? activity.activity_date.split("T")[0]
    : today(),
});

const ActivityFormModal = ({ isOpen, onClose, jobId, activity = null }) => {
  const [form, setForm] = useState(buildEmpty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const isEdit = Boolean(activity);

  useEffect(() => {
    if (isOpen) {
      setForm(activity ? activityToForm(activity) : buildEmpty());
      setError("");
    }
  }, [isOpen, activity]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
      };

      if (isEdit) {
        await updateActivity(jobId, activity.id, payload);
      } else {
        await createActivity(jobId, payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["activities", jobId] });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to ${isEdit ? "update" : "log"} activity`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Activity" : "Log Activity"}
      size="md"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              Type <span className="text-amber-400">*</span>
            </label>
            <select
              className="input"
              value={form.type}
              onChange={set("type")}
              required
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              Date <span className="text-amber-400">*</span>
            </label>
            <input
              className="input"
              type="date"
              value={form.activity_date}
              onChange={set("activity_date")}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">
            Title <span className="text-amber-400">*</span>
          </label>
          <input
            className="input"
            placeholder="Phone screen with Sarah from recruiting"
            value={form.title}
            onChange={set("title")}
            required
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input resize-none h-24"
            placeholder="What happened? Topics discussed, takeaways, follow-up actions..."
            value={form.description}
            onChange={set("description")}
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
                : "Logging..."
              : isEdit
                ? "Save Changes"
                : "Log Activity"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityFormModal;
