import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const ids = await redis.zrange("notes:index", 0, -1, { rev: true });
    const documents = ids.length
      ? (await redis.mget(...ids.map((id) => `note:${id}`))).filter(Boolean)
      : [];
    return res.status(200).json({ documents });
  }

  if (req.method === "POST") {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const note = { $id: id, $createdAt: now, $updatedAt: now, ...req.body };

    await redis.set(`note:${id}`, note);
    await redis.zadd("notes:index", { score: Date.now(), member: id });

    return res.status(201).json(note);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
