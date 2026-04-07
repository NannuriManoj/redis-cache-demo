import { slidingWindowRateLimit } from "../helpers/rateLimit.js";

export function createRateLimiter({ prefix, limit, windowSeconds }) {
  return async function (request, reply) {
    const identifier = request.headers['x-user-id'] || request.ip;

    const results = await slidingWindowRateLimit(
      `${prefix}:${identifier}`,
      limit,
      windowSeconds
    );

    if (!results.allowed) {
      return reply.code(429).send({
        error: 'Too many requests',
        message: `Try again in ${results.retryAfter} seconds`,
        retryAfter: results.retryAfter
      });
    }
  };
}