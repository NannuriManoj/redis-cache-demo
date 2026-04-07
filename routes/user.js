import redis from "../config/redis.js";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// avoid cache stampede by adding random TTL to cache entries (3600-4200 seconds)
const ttl = 3600 + Math.floor(Math.random() * 600);

// GET /users/:id - Fetch user data with caching
export async function getUser(request, reply) {
    const { id } = request.params;
    const cacheKey = `user:${id}`;

    try{
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            request.log.info(`Cache hit for user ${id}`);
            return reply.send({
                source: "cache",
                data: JSON.parse(cachedData),
            });
        }
        request.log.info(`Cache miss for user ${id}, fetching from API`);
        const response = await fetch(`${BASE_URL}/users/${id}`);
        const user = await response.json();

        await redis.setex(cacheKey, ttl, JSON.stringify(user));
        request.log.info(`User ${id} cached with TTL of ${ttl} seconds`);
        return reply.send({
            source: "api",
            data: user,
        });
    }
    catch (error) {
        request.log.error(`Error fetching user ${id}: ${error.message}`);
        return reply.code(500).send({ error: "Failed to fetch user data" });
    }
}

// GET /users - Fetch all users with caching
    export async function getAllUsers(request, reply) {
        const cacheKey = "users:all";
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                request.log.info("Cache hit for all users");
                return reply.send({
                    source: "cache",
                    data: JSON.parse(cachedData),
                });
            }

            request.log.info("Cache miss for all users, fetching from API");
            const response = await fetch(`${BASE_URL}/users`);
            const users = await response.json();
            
            await redis.setex(cacheKey, ttl, JSON.stringify(users));
            request.log.info(`All users cached with TTL of ${ttl} seconds`);
            return reply.send({
                source: "api",
                data: users,
            });
        } catch (error) {
            request.log.error(`Error fetching all users: ${error.message}`);
            return reply.code(500).send({ error: "Failed to fetch users data" });
        }
    }