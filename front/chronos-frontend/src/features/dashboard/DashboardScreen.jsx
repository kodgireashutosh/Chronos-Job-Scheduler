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
    </div>
  );
};
export default DashboardScreen;
