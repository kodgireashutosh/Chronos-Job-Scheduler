import Button from "../../components/Button";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import CreateJobModal from "./CreateJobModel";
import { useEffect, useState, useCallback } from "react";
import { Mail, Activity, ChevronRight, Search } from "lucide-react";
import { fetchJobs } from "./jobs.api";
const formatUtcToIst = (utcString) => {
  if (!utcString) return "-";

  return new Date(utcString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const JobsListScreen = ({ onSelectJob }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ SINGLE SOURCE OF TRUTH
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchJobs();
      setJobs(data || []);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and configure scheduled tasks
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <div className="relative rounded-lg shadow-sm max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2"
              placeholder="Search by name or ID..."
            />
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="mr-2">+</span> New Job
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Job Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Schedule
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                  Next Run
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    Loading jobs...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            job.jobType === "EMAIL"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-pink-50 text-pink-600"
                          }`}
                        >
                          {job.jobType === "EMAIL" ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <Activity className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {job.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            ID: {job.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {job.scheduleType}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                          {job.cron || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {job.scheduleType === "ONCE" || !job.nextRunAt ? (
                        "-"
                      ) : (
                        <>
                          {formatUtcToIst(job.nextRunAt)}
                          <div className="text-xs text-slate-400">(IST)</div>
                        </>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-slate-400 hover:text-blue-600"
                        onClick={() => onSelectJob(job)}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ✅ IMPORTANT PART */}
      {showCreateModal && (
        <CreateJobModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadJobs(); // 🔥 THIS IS THE FIX
          }}
        />
      )}
    </div>
  );
};

export default JobsListScreen;
