import { Clock, CheckCircle, XCircle, RefreshCw, Ban } from "lucide-react";


const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    RUNNING: "bg-blue-100 text-blue-800 border-blue-200",
    FAILED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons = {
    COMPLETED: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    PENDING: <Clock className="w-3.5 h-3.5 mr-1.5" />,
    RUNNING: <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />,
    FAILED: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
    CANCELLED: <Ban className="w-3.5 h-3.5 mr-1.5" />,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles.CANCELLED
      }`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default StatusBadge;