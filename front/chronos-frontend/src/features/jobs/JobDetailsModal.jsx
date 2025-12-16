import Button from '../../components/Button';
import { Clock , Calendar, CheckCircle, XCircle, Mail, Activity, RefreshCw} from 'lucide-react';

const MOCK_HISTORY = [
  {
    id: 101,
    attempt: 1,
    status: "SUCCESS",
    started: "2023-11-15 10:30:00",
    ended: "2023-11-15 10:30:45",
    error: null,
  },
  {
    id: 102,
    attempt: 1,
    status: "FAILURE",
    started: "2023-11-15 10:15:00",
    ended: "2023-11-15 10:15:02",
    error: "Timeout: Worker node unresponsive",
  },
  {
    id: 103,
    attempt: 2,
    status: "SUCCESS",
    started: "2023-11-15 10:16:00",
    ended: "2023-11-15 10:16:45",
    error: null,
  },
];

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

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
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    job.type === "EMAIL"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-pink-100 text-pink-600"
                  }`}
                >
                  {job.type === "EMAIL" ? (
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
                    {job.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 font-mono">
                    ID: {job.id}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={job.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Schedule
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {job.schedule}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1 pl-6">
                  {job.cron}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Last Execution
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {job.lastRun.split(" ")[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-6">
                  {job.lastRun.split(" ")[1]}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Reliability
                </p>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-900">
                    {job.retries} / 5 Retries
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </div>

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
                    {MOCK_HISTORY.map((run) => (
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
                          {run.error && (
                            <div className="text-xs text-red-500 mt-1 font-medium bg-red-50 p-1 rounded">
                              {run.error}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {run.started}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600 font-mono">
                          45s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-slate-200 gap-3">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Trigger Job Now
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 mr-auto"
            >
              Stop Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;