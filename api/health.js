import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    await redis.set("health:heartbeat", new Date().toISOString());
    return res.status(200).json({ status: "ok", redis: "up" });
  } catch (error) {
    console.error(error);
    return res.status(503).json({ status: "error", redis: "down" });
  }
}
