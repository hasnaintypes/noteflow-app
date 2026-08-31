import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const note = await redis.get(`note:${id}`);
    if (!note) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(note);
  }

  if (req.method === "PATCH") {
    const existing = await redis.get(`note:${id}`);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const updated = {
      ...existing,
      ...req.body,
      $id: id,
      $updatedAt: new Date().toISOString(),
    };
    await redis.set(`note:${id}`, updated);

    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await redis.del(`note:${id}`);
    await redis.zrem("notes:index", id);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).end("Method Not Allowed");
}
