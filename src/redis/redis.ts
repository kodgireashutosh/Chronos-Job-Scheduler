import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

export const SCHEDULED_KEY = "chronos:scheduled";
export const PROCESSING_KEY = "chronos:processing";
