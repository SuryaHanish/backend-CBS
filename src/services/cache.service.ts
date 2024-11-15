// services/cache.service.ts
import redisClient from '../config/redisClient';

export const cacheData = async (key: string, value: any, ttl: number | null = null) => {
  const stringValue = JSON.stringify(value);
  if (ttl) {
    await redisClient.set(key, stringValue, 'EX', ttl); // EX sets the expiration time in seconds
  } else {
    await redisClient.set(key, stringValue);
  }
};

export const getCacheData = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const clearCache = async (key: string) => {
  await redisClient.del(key);
};
