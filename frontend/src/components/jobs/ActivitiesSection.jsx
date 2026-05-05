import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Activity, AlertTriangle, Loader2 } from "lucide-react";
import {
  getActivities,
  deleteActivity,
} from "../../services/activitiesService";
import Modal from "../shared/Modal";
import LoadingSpinner from "../shared/LoadingSpinner";
import ActivityTimeline from "./ActivityTimeline";
import ActivityFormModal from "./ActivityFormModal";

const ActivitiesSection = ({ jobId }) => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", jobId],
    queryFn: () => getActivities(jobId),
  });

  const deleteMutation = useMutation({
    mutationFn: (activityId) => deleteActivity(jobId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", jobId] });
      setActivityToDelete(null);
    },
  });

  const openAdd = () => {
    setEditingActivity(null);
    setFormOpen(true);
  };

  const openEdit = (activity) => {
    setEditingActivity(activity);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingActivity(null);
  };

  // Newest first by activity_date, falling back to created_at for tiebreaks
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.activity_date || a.created_at);
    const dateB = new Date(b.activity_date || b.created_at);
    return dateB - dateA;
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Activity size={16} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-200">
              Activities
            </h2>
            <p className="text-xs text-slate-500">
              {activities.length === 0
                ? "No activities logged"
                : `${activities.length} ${activities.length === 1 ? "entry" : "entries"}`}
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} />
          Log Activity
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner size="md" />
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-base-600 bg-base-800/40 p-8 text-center">
          <p className="text-sm text-slate-400">
            Phone screens, interviews, follow-ups — log every touchpoint.
          </p>
          <button
            onClick={openAdd}
            className="text-sm text-amber-400 hover:text-amber-300 mt-2 transition-colors"
          >
            Log your first activity →
          </button>
        </div>
      ) : (
        <ActivityTimeline
          activities={sortedActivities}
          onEdit={openEdit}
          onDelete={setActivityToDelete}
        />
      )}

      <ActivityFormModal
        isOpen={formOpen}
        onClose={closeForm}
        jobId={jobId}
        activity={editingActivity}
      />

      <Modal
        isOpen={Boolean(activityToDelete)}
        onClose={() => {
          if (!deleteMutation.isPending) setActivityToDelete(null);
        }}
        title="Delete this activity?"
        size="sm"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10 border border-red-400/20 mb-4">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <p className="text-sm text-slate-400">
          You're about to remove{" "}
          <span className="text-slate-200">{activityToDelete?.title}</span> from
          this job's timeline. This can't be undone.
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
            onClick={() => setActivityToDelete(null)}
            disabled={deleteMutation.isPending}
            className="btn-ghost disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate(activityToDelete.id)}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            {deleteMutation.isPending ? "Deleting..." : "Delete activity"}
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default ActivitiesSection;
