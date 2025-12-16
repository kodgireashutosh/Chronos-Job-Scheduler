
import { Clock , Globe, Mail, XCircle} from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useState } from 'react';

const CreateJobModal = ({ onClose }) => {
  const [jobType, setJobType] = useState("WEBHOOK"); // WEBHOOK or EMAIL
  const [scheduleType, setScheduleType] = useState("ONCE"); // ONCE, DAILY, WEEKLY, MONTHLY, CRON

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

            <form className="space-y-5">
              <Input
                label="Job Name"
                id="jobName"
                placeholder="e.g., Daily Data Sync"
              />

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

              {jobType === "WEBHOOK" ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <Input
                    label="Target URL"
                    id="targetUrl"
                    placeholder="https://api.example.com/webhooks/trigger"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        HTTP Method
                      </label>
                      <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option>POST</option>
                        <option>GET</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      JSON Payload (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24 font-mono text-xs"
                      placeholder='{"key": "value"}'
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <Input
                    label="Recipient Email"
                    id="recipient"
                    placeholder="user@example.com"
                  />
                  <Input
                    label="Subject"
                    id="subject"
                    placeholder="Notification Subject"
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email Body
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
                      placeholder="Enter email content..."
                    ></textarea>
                  </div>
                </div>
              )}

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
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={scheduleType}
                      onChange={(e) => setScheduleType(e.target.value)}
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
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {scheduleType === "ONCE" && (
                  <div className="mb-4 animate-in fade-in slide-in-from-top-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

                {scheduleType === "WEEKLY" && (
                  <div className="mb-4 animate-in fade-in slide-in-from-top-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Repeat on
                    </label>
                    <div className="flex gap-2">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all ${
                            i === 1
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {scheduleType === "MONTHLY" && (
                  <div className="mb-4 animate-in fade-in slide-in-from-top-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Day of Month
                    </label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                          {[1, 21, 31].includes(i + 1)
                            ? "st"
                            : [2, 22].includes(i + 1)
                            ? "nd"
                            : [3, 23].includes(i + 1)
                            ? "rd"
                            : "th"}
                        </option>
                      ))}
                      <option value="LAST">Last Day</option>
                    </select>
                  </div>
                )}

                {scheduleType === "CRON" && (
                  <div className="animate-in fade-in slide-in-from-top-1">
                    <Input
                      label="Cron Expression"
                      id="cron"
                      placeholder="0 0 * * *"
                    />
                    <p className="text-xs text-slate-500 -mt-3 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Format: Minute Hour Day Month Weekday
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="bg-slate-50 px-4 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-slate-200 gap-3">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Create Job
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