import { api } from "@/lib/api";

export async function fetchJobs() {
  const res = await api.get("/jobs");
  return res.data;
}

export async function fetchJob(jobId: number) {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
}

export async function fetchJobExecutions(jobId: number) {
  const res = await api.get(`/jobs/${jobId}/executions`);
  return res.data;
}

export async function createJob(payload: any) {
  const res = await api.post("/jobs", payload);
  return res.data;
}

export async function triggerJob(jobId: number) {
  const res = await api.post(`/jobs/${jobId}/trigger`);
  console.log(res.data);
  return res.data;
}

export async function stopJob(jobId: number) {
  const res = await api.post(`/jobs/${jobId}/cancel`);
  return res.data;
}
