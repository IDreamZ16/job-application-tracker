import { JOB_STATUSES } from "../../utils/constants";

const StatusBadge = ({ status }) => {
  const config = JOB_STATUSES[status];
  if (!config) return null;

  return <span className={`badge border ${config.color}`}>{config.label}</span>;
};

export default StatusBadge;
