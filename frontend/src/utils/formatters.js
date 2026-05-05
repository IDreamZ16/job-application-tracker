export const formatSalary = (min, max) => {
  if (!min && !max) return null;

  // If every present value is under 1000, treat as hourly. Otherwise annual.
  const isHourly = [min, max].filter(Boolean).every((v) => v < 1000);

  const fmt = (n) =>
    isHourly ? `${Math.round(n)}` : `${Math.round(n / 1000)}k`;
  const suffix = isHourly ? "/hr" : "";

  if (min && max) return `${fmt(min)} - ${fmt(max)}${suffix}`;
  if (min) return `${fmt(min)}+${suffix}`;
  return `Up to ${fmt(max)}${suffix}`;
};

export const formatDate = (date) => {
  if (!date) return null;
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(date));
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};