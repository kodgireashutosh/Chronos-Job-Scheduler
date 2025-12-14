import { Queue } from "bullmq";
import { redis } from "./redis";

export const jobQueue = new Queue("chronos-jobs", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000
    }
  }
});
