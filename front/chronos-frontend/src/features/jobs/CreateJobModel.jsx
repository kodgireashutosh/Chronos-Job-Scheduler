import { Clock, Globe, Mail, XCircle } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { createJob } from "./jobs.api";

const CreateJobModal = ({ onClose, onCreated }) => {
  const [jobName, setJobName] = useState("");

  const [jobType, setJobType] = useState("WEBHOOK");
  const [scheduleType, setScheduleType] = useState("ONCE");

  // Webhook fields
  const [targetUrl, setTargetUrl] = useState("");
  const [method, setMethod] = useState("POST");

  // Email fields
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // Schedule fields
  const [time, setTime] = useState("00:00");
  const [date, setDate] = useState("");
  const [cron, setCron] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- helpers ----------
  const buildCron = () => {
    const [hh, mm] = time.split(":");

    switch (scheduleType) {
      case "DAILY":
        return `${mm} ${hh} * * *`;
      case "WEEKLY":
        return `${mm} ${hh} * * 1`;
      case "MONTHLY":
        return `${mm} ${hh} 1 * *`;
      case "CRON":
        return cron;
      default:
        return null;
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      const isCron = scheduleType !== "ONCE";

      const payload =
        jobType === "WEBHOOK"
          ? { url: targetUrl, method }
          : { to: recipient, subject, body };

      await createJob({
        name: jobName,
        jobType,
        scheduleType: isCron ? "CRON" : "ONCE",
        runAt: !isCron && date ? `${date}T${time}:00Z` : undefined,
        cron: isCron ? buildCron() : undefined,
        payload,
      });

      // ✅ THIS IS THE FIX
      onCreated?.(); // refresh job list in parent
      onClose();
    } catch (e) {
      setError("Failed to create job");
    } finally {
      setLoading(false);
    }
  };

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
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Create New Job
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="Job Name"
                id="jobName"
                placeholder="e.g., Daily Data Sync"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
              />

              {/* Job Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                      jobType === "WEBHOOK"
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                        : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    onClick={() => setJobType("WEBHOOK")}
                  >
                    <Globe className="w-6 h-6" />
                    <span className="font-semibold text-sm">Webhook</span>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                      jobType === "EMAIL"
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                        : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    onClick={() => setJobType("EMAIL")}
                  >
                    <Mail className="w-6 h-6" />
                    <span className="font-semibold text-sm">Email</span>
                  </div>
                </div>
              </div>

              {/* Payload */}
              {jobType === "WEBHOOK" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <Input
                    label="Target URL"
                    id="targetUrl"
                    placeholder="https://api.example.com/webhooks/trigger"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        HTTP Method
                      </label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option>POST</option>
                        <option>GET</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <Input
                    label="Recipient Email"
                    id="recipient"
                    placeholder="user@example.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <Input
                    label="Subject"
                    id="subject"
                    placeholder="Notification Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <textarea
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
                    placeholder="Enter email content..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              )}

              {/* Schedule */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Schedule Configuration
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Frequency
                    </label>
                    <select
                      value={scheduleType}
                      onChange={(e) => setScheduleType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="ONCE">One-time</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="CRON">Custom (Cron)</option>
                    </select>
                  </div>

                  {scheduleType !== "CRON" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Time (UTC)
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {scheduleType === "ONCE" && (
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}

                {scheduleType === "CRON" && (
                  <Input
                    label="Cron Expression"
                    id="cron"
                    placeholder="0 0 * * *"
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                  />
                )}
              </div>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
            </form>
          </div>

          <div className="bg-slate-50 px-4 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-slate-200 gap-3">
            <Button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Job"}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;
