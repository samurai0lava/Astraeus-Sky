import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis error:", err));

export async function connectRedis() {
  if (!client.isOpen) await client.connect();
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds = 30): Promise<void> {
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.error("Redis set error:", err);
  }
}

export default client;