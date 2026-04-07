import redis from "../config/redis.js";

export async function slidingWindowRateLimit(identifer, limit = 10, windowSeconds = 60){
    const key = `ratelimit:sliding:${identifer}`;
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000) 

    const pipeline = redis.pipeline();

    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, `${now} - ${Math.random()}`)
    pipeline.zcard(key)
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();

    const requestCount = results[2][1];

    if(requestCount > limit){
        const oldest = await redis.zrange(key, 0,0, 'WITHSCORES');
        const oldestTIme = parseInt(oldest[1]);
        const retryAfter = Math.ceil((oldestTIme + windowSeconds * 1000 - now)/1000);

        return {
            allowed: false,
            limit,
            count: requestCount,
            retryAfter
        }
    }

    return {
        allowed: true,
        limit,
        count: requestCount,
        remaining: limit - requestCount
    }
}