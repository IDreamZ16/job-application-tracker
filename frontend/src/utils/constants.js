export const JOB_STATUSES = {
  saved:        { label: 'Saved',        color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
  applied:      { label: 'Applied',      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  interviewing: { label: 'Interviewing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  offer:        { label: 'Offer',        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  rejected:     { label: 'Rejected',     color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export const JOB_TYPES = {
  remote: { label: 'Remote',  color: 'text-emerald-400' },
  hybrid: { label: 'Hybrid',  color: 'text-amber-400' },
  onsite: { label: 'On-site', color: 'text-blue-400' },
};

export const ACTIVITY_TYPES = [
  { value: 'applied',      label: '📨 Applied' },
  { value: 'email',        label: '✉️ Email' },
  { value: 'phone_screen', label: '📞 Phone Screen' },
  { value: 'interview',    label: '🎤 Interview' },
  { value: 'offer',        label: '🎉 Offer' },
  { value: 'rejected',     label: '❌ Rejected' },
  { value: 'note',         label: '📝 Note' },
];

export const KANBAN_COLUMNS = [
  { id: 'saved',        label: 'Saved' },
  { id: 'applied',      label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer',        label: 'Offer' },
  { id: 'rejected',     label: 'Rejected' },
];