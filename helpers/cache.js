import redis from '../config/redis.js';

export async function withCache(key, ttl, fetchFunction) {
  let freshData;

  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    freshData = await fetchFunction();

    await redis.set(key, JSON.stringify(freshData),  'EX', ttl);

    return freshData;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);

    if (!freshData) {
      return await fetchFunction();
    }

    return freshData;
  }
}