import type { NextFunction, Request, Response } from "express";

// ip and all req's time stamp
const users: Map<string, number[]> = new Map();

export function slidingWindowLogRateLimiter(
  maxRequests: number,
  windowSize: number, // in sec
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip?.split("::ffff:")[1] ?? "11";

    const now = Date.now();
    const windowStart = now - windowSize * 1000;

    const timeStamps = users.get(ip) || [];

    const validTimeStamps = timeStamps.filter((t) => t > windowStart);

    if (validTimeStamps.length >= maxRequests) {
      return res.status(429).json({
        message: "too many requests",
      });
    }

    validTimeStamps.push(now);
    users.set(ip, validTimeStamps);

    next();
  };
}
