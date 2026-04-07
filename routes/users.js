import { withCache } from "../helpers/cache.js";
const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function getUser(request, reply) {
  const { id } = request.params;

  const user = await withCache(`user:${id}`, 3600, async () => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });

  reply.send(user);
}