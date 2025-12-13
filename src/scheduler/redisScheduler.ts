import { redis, SCHEDULED_KEY, PROCESSING_KEY } from "../redis/redis";

export async function fetchDueJob(now: number): Promise<string | null> {
    const lua = `
    local job = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, 1)
    if #job == 0 then return nil end
    redis.call('ZREM', KEYS[1], job[1])
    redis.call('HSET', KEYS[2], job[1], ARGV[2])
    return job[1]
  `;
    const result = await redis.eval(
        lua,
        2,
        SCHEDULED_KEY,
        PROCESSING_KEY,
        now,
        Date.now().toString()
    );

    return result ? String(result) : null;

}
