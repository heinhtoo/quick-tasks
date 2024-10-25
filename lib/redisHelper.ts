import redisClient from "./redis";

export async function deleteCache(cacheMainKey: string, ...others: string[]) {
  await redisClient.del(`${cacheMainKey}:${others.join(":")}`);
}

export async function getCache(key: string) {
  const data = await redisClient.get(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export async function deleteCacheWithPrefix(prefix: string) {
  const keys = await redisClient.keys(`${prefix}*`); // Find all keys with the prefix
  if (keys.length > 0) {
    await redisClient.del(keys); // Delete all found keys
  }
}
