import type { NextFunction, Request, Response } from "express";
import { createClient } from "redis";

type redisClient = ReturnType<typeof createClient>;

const client = await createClient().connect();

export const rateLimit = (maxRequests: number, timeOut: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip?.split("::ffff:")[1] ?? "11";

    const count = await client.incr(`user:${ip}`);
    console.log("count ", count);
    await client.expire(`user:${ip}`, timeOut);

    if (count >= maxRequests) {
      return res.status(429).json({
        message: "too many requests",
      });
    }

    next();
  };
};
