import { slidingWindowRateLimit } from "../helpers/rateLimit.js"

export async function rateLimitMiddleware(request, reply) {
    const identifer = request.headers['x-user-id'] || request.ip;
    const results = await slidingWindowRateLimit(identifer, 10, 60)

    reply.header('X-RateLimit-Limit', results.limit);
    reply.header('X-RateLimit-Remaining', results.remaining || 0);
    reply.header('X-RateLimit-Count', results.count);

    if(!results.allowed){
        request.log.warn({
            identifer,
            count: results.count,
            limit: results.limit,
            retryAfter: results.retryAfter
        }, 'Rate Limit Exceeded');

        reply.header('Retry-After', results.retryAfter);

        return reply.code(429).send({
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${results.retryAfter} seconds.`,
            retryAfter: results.retryAfter
        })
    }

    request.log.info({
        identifer,
        count: results.count,
        remaining: results.remaining
    }, 'Request allowed')
}