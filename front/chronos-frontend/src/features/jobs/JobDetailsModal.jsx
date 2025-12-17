import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Mail,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchJob,
  fetchJobExecutions,
  triggerJob,
  stopJob,
} from "./jobs.api";

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const [jobDetails, setJobDetails] = useState(job);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [stopping, setStopping] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDetails = async () => {
      try {
        const [jobRes, execRes] = await Promise.all([
          fetchJob(job.id),
          fetchJobExecutions(job.id),
        ]);

        if (!mounted) return;

        setJobDetails(jobRes);
        setHistory(execRes || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      mounted = false;
    };
  }, [job.id]);

  const handleTrigger = async () => {
    try {
      setTriggering(true);
      await triggerJob(job.id);
      const execRes = await fetchJobExecutions(job.id);
      setHistory(execRes || []);
    } finally {
      setTriggering(false);
    }
  };

  const handleStop = async () => {
    try {
      setStopping(true);
      await stopJob(job.id);

      // refresh job + history
      const [jobRes, execRes] = await Promise.all([
        fetchJob(job.id),
        fetchJobExecutions(job.id),
      ]);

      setJobDetails(jobRes);
      setHistory(execRes || []);
    } finally {
      setStopping(false);
    }
  };

  const isCron = jobDetails.scheduleType === "CRON";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    jobDetails.type === "EMAIL"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-pink-100 text-pink-600"
                  }`}
                >
                  {jobDetails.type === "EMAIL" ? (
                    <Mail className="w-6 h-6" />
                  ) : (
                    <Activity className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3
                    className="text-xl font-bold text-slate-900"
                    id="modal-title"
                  >
                    {jobDetails.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 font-mono">
                    ID: {jobDetails.id}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={jobDetails.status} />
              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Schedule
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {jobDetails.scheduleType}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1 pl-6">
                  {isCron
                    ? jobDetails.cron
                    : jobDetails.runAt
                    ? new Date(jobDetails.runAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Last Execution
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {jobDetails.lastExecutionAt
                      ? new Date(jobDetails.lastExecutionAt).toLocaleString()
                      : history.length > 0
                      ? new Date(history[0].startedAt).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Reliability
                </p>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {jobDetails.attemptsMade} / {jobDetails.maxRetries} Retries
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (jobDetails.attemptsMade / jobDetails.maxRetries) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* EXECUTION HISTORY */}
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-4">
                Execution History
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Run ID
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Result
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Started At
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-5 py-6 text-center text-sm text-slate-500">
                          Loading execution history...
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-5 py-6 text-center text-sm text-slate-500">
                          No executions yet
                        </td>
                      </tr>
                    ) : (
                      history.map((run) => (
                        <tr key={run.id}>
                          <td className="px-5 py-3 text-sm font-mono text-slate-500">
                            #{run.id}
                          </td>
                          <td className="px-5 py-3 text-sm">
                            <span
                              className={`inline-flex items-center text-xs font-bold ${
                                run.status === "SUCCESS"
                                  ? "text-emerald-700"
                                  : "text-red-700"
                              }`}
                            >
                              {run.status === "SUCCESS" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {run.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-600">
                            {new Date(run.startedAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-600 font-mono">
                            {Math.max(
                              0,
                              (new Date(run.endedAt) -
                                new Date(run.startedAt)) /
                                1000
                            )}
                            s
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-slate-50 px-4 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-slate-200 gap-3">
            <Button
              onClick={handleTrigger}
              disabled={triggering}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {triggering ? "Triggering..." : "Trigger Job Now"}
            </Button>

            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Close
            </Button>

            <Button
              onClick={handleStop}
              disabled={stopping}
              variant="ghost"
              className="w-full sm:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 mr-auto"
            >
              {stopping ? "Stopping..." : "Stop Job"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
