import {
  Clock,
  Calendar,
  Server,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { fetchDashboardMetrics } from "./dashboard.api";

const DashboardScreen = () => {
  const [metrics, setMetrics] = useState(null);
  const [range, setRange] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMetrics = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await fetchDashboardMetrics(range);
      setMetrics(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [range]);

  const Metric = ({ title, value, colorClass, icon: Icon, trend }) => (
    <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">
          {loading ? "—" : value}
        </p>
        {trend && !loading && (
          <div className="flex items-center mt-2 text-xs font-medium text-emerald-600">
            <span>+12% from yesterday</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            System performance overview
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs h-9">
            <Calendar className="w-4 h-4 mr-2" />
            Last 24 Hours
          </Button>

          <Button
            onClick={() => loadMetrics(true)}
            disabled={refreshing}
            className="h-9 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          title="Total Jobs"
          value={metrics?.total ?? 0}
          colorClass="bg-slate-700"
          icon={Server}
          trend
        />
        <Metric
          title="Completed"
          value={metrics?.completed ?? 0}
          colorClass="bg-emerald-600"
          icon={CheckCircle}
        />
        <Metric
          title="Failed"
          value={metrics?.failed ?? 0}
          colorClass="bg-red-600"
          icon={AlertTriangle}
        />
        <Metric
          title="Pending"
          value={metrics?.pending ?? 0}
          colorClass="bg-amber-500"
          icon={Clock}
        />
      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JOB THROUGHPUT */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Job Throughput
            </h3>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          <div className="h-72 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
            <div className="text-center">
              <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <span className="text-slate-400 text-sm font-medium">
                Chart Visualization Area
              </span>
            </div>
          </div>
        </Card>

        {/* SYSTEM STATUS (UI-only for now) */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              System Status
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            <StatusRow label="Scheduler Service" status="Operational" ok />
            <StatusRow label="Worker Nodes (12/12)" status="100% Uptime" ok />
            <StatusRow label="Primary Database" status="Healthy" ok />
            <StatusRow
              label="SMTP Relay"
              status="High Latency"
              warning
            />
          </div>

          <div className="p-4 bg-slate-50 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Full System Report
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatusRow = ({ label, status, ok, warning }) => (
  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <div
        className={`w-2 h-2 rounded-full ${
          ok
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
        }`}
      ></div>
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>
    </div>
    <span
      className={`text-xs font-semibold px-2 py-1 rounded ${
        ok
          ? "text-emerald-700 bg-emerald-50"
          : "text-amber-700 bg-amber-50"
      }`}
    >
      {status}
    </span>
  </div>
);

export default DashboardScreen;
