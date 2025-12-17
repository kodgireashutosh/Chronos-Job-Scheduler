import { Queue } from "bullmq";
import { redis } from "./redis";

export const jobQueue = new Queue("chronos-jobs", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,              // retries
    backoff: {
      type: "exponential",
      delay: 5000
    },
    removeOnComplete: false,
    removeOnFail: false
  }
});

export const deadLetterQueue = new Queue("chronos-dlq", {
  connection: redis
});
