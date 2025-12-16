import Button from "../../components/Button";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import CreateJobModal from "./CreateJobModel";
import { useState } from "react";
import { Mail, Activity, ChevronRight, Search, CheckCircle } from "lucide-react";

const MOCK_JOBS = [
  {
    id: 1,
    name: "Daily Revenue Report",
    type: "EMAIL",
    schedule: "CRON",
    cron: "0 0 * * *",
    status: "COMPLETED",
    nextRun: "2023-11-16 00:00:00",
    retries: 0,
    lastRun: "2023-11-15 00:00:00",
  },
  {
    id: 2,
    name: "Data Warehouse Sync",
    type: "WEBHOOK",
    schedule: "CRON",
    cron: "*/15 * * * *",
    status: "RUNNING",
    nextRun: "2023-11-15 10:45:00",
    retries: 0,
    lastRun: "2023-11-15 10:30:00",
  },
  {
    id: 3,
    name: "User Cleanup",
    type: "WEBHOOK",
    schedule: "ONCE",
    cron: "-",
    status: "FAILED",
    nextRun: "-",
    retries: 3,
    lastRun: "2023-11-14 23:15:00",
  },
  {
    id: 4,
    name: "Weekly Newsletter",
    type: "EMAIL",
    schedule: "CRON",
    cron: "0 9 * * 1",
    status: "PENDING",
    nextRun: "2023-11-20 09:00:00",
    retries: 0,
    lastRun: "2023-11-13 09:00:00",
  },
  {
    id: 5,
    name: "Legacy Data Migration",
    type: "WEBHOOK",
    schedule: "ONCE",
    cron: "-",
    status: "CANCELLED",
    nextRun: "-",
    retries: 0,
    lastRun: "-",
  },
  {
    id: 6,
    name: "System Health Check",
    type: "WEBHOOK",
    schedule: "CRON",
    cron: "*/5 * * * *",
    status: "COMPLETED",
    nextRun: "2023-11-15 10:50:00",
    retries: 1,
    lastRun: "2023-11-15 10:45:00",
  },
];

const JobsListScreen = ({ onSelectJob }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

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
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Job Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Schedule
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  Next Run
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {MOCK_JOBS.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          job.type === "EMAIL"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-pink-50 text-pink-600"
                        }`}
                      >
                        {job.type === "EMAIL" ? (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">
                        {job.schedule}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                        {job.cron}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    {job.nextRun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">6</span> of{" "}
                <span className="font-medium">6</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </Card>

      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default JobsListScreen;
