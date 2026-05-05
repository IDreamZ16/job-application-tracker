import {
  Send,
  Mail,
  Phone,
  Mic,
  PartyPopper,
  XCircle,
  StickyNote,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

// Visual mapping for activity types — icon + ring color per type.
// Source of truth for ACTIVITY_TYPES values lives in utils/constants.js.
const ACTIVITY_VISUALS = {
  applied: {
    icon: Send,
    label: "Applied",
    ring: "border-blue-400/30 bg-blue-400/10 text-blue-400",
  },
  email: {
    icon: Mail,
    label: "Email",
    ring: "border-slate-400/30 bg-slate-400/10 text-slate-400",
  },
  phone_screen: {
    icon: Phone,
    label: "Phone Screen",
    ring: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  interview: {
    icon: Mic,
    label: "Interview",
    ring: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  offer: {
    icon: PartyPopper,
    label: "Offer",
    ring: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    ring: "border-red-400/30 bg-red-400/10 text-red-400",
  },
  note: {
    icon: StickyNote,
    label: "Note",
    ring: "border-slate-400/30 bg-slate-400/10 text-slate-400",
  },
};

const FALLBACK = ACTIVITY_VISUALS.note;

const ActivityTimeline = ({ activities, onEdit, onDelete }) => (
  <ol className="list-none">
    {activities.map((activity, idx) => {
      const visual = ACTIVITY_VISUALS[activity.type] || FALLBACK;
      const Icon = visual.icon;
      const isLast = idx === activities.length - 1;

      return (
        <li key={activity.id} className="flex gap-4 group">
          {/* Icon + rail column */}
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-9 h-9 rounded-full border flex items-center justify-center ${visual.ring}`}
            >
              <Icon size={15} />
            </div>
            {!isLast && <div className="w-px flex-1 bg-base-600 mt-1" />}
          </div>

          {/* Content column */}
          <div className={`flex-1 min-w-0 ${!isLast ? "pb-6" : ""}`}>
            <div className="card p-4 hover:border-base-500 transition-all duration-150">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[11px] uppercase tracking-wider font-medium text-slate-500">
                      {visual.label}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(activity.activity_date) || "Unknown date"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 break-words">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed whitespace-pre-wrap break-words">
                      {activity.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(activity)}
                    className="text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 p-1.5 rounded-md transition-colors"
                    aria-label={`Edit ${activity.title}`}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(activity)}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors"
                    aria-label={`Delete ${activity.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    })}
  </ol>
);

export default ActivityTimeline;
