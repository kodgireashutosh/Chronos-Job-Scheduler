import { api } from "@/lib/api";

export async function fetchDashboardMetrics(range = "24h") {
  const res = await api.get("/dashboard/metrics", {
    params: { range },
  });
  return res.data;
}
