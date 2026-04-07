import Fastify from "fastify";
import { loggerConfig } from "./logger.js";
// import { getUser, getAllUsers } from "./routes/user.js";
import { getUser } from "./routes/users.js";
import { rateLimitMiddleware  } from "./middleware/rateLimit.js";
import { loginHandler } from './routes/auth.js';
// import { slidingWindowRateLimit } from "./helpers/rateLimit.js";
import { createRateLimiter } from "./middleware/routeRateLimit.js";

const fastify = Fastify({ logger : loggerConfig });

fastify.addHook('preHandler',rateLimitMiddleware);

// Register routes
fastify.get("/users/:id", getUser);
// fastify.get("/users", getAllUsers);

const loginRateLimiter = createRateLimiter({
  prefix: 'login',
  limit: 5,
  windowSeconds: 300
});

fastify.post('/login', {
  preHandler: loginRateLimiter
}, loginHandler);

// fastify.post('/login', {
//   preHandler: async (request, reply) => {
//     // use x-user-id header if present, otherwise fall back to IP
//     const identifier = request.headers['x-user-id'] || request.ip

//     const results = await slidingWindowRateLimit(
//       `login:${identifier}`,
//       5,    // 5 attempts
//       300   // per 5 minutes
//     )

//     if (!results.allowed) {
//       return reply.code(429).send({
//         error: 'Too many login attempts',
//         message: `Try again in ${results.retryAfter} seconds`,
//         retryAfter: results.retryAfter
//       })
//     }
//   }
// }, loginHandler)


// Health check endpoint
fastify.get("/health", async (request, reply) => {
    return { status: "ok" };
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info("Server is running on http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();