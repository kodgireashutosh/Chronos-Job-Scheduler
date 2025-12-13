import { fetchDueJob } from "../scheduler/redisScheduler";

export async function poll(): Promise<string> {
  while (true) {
    const jobId = await fetchDueJob(Date.now());
    if (jobId) return jobId;
    await new Promise(r => setTimeout(r, 1000));
  }
}
