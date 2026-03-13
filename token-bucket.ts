// each user based

import type { NextFunction, Request, Response } from "express";

const INIT_TOKENS = 10;
const CAPACITY = 10;
const REFILL_RATE = 2;

const users: Map<string, { lastRefillTimestamp: number; token: number }> =
  new Map();

export function tokenBucketRatelimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip?.split("::ffff:")[1] ?? "11";

    if (!users.has(ip)) {
      users.set(ip, { token: INIT_TOKENS, lastRefillTimestamp: Date.now() });
    }

    const user = users.get(ip)!;

    if (user.token === 0) {
      users.set(ip, { token: INIT_TOKENS, lastRefillTimestamp: Date.now() });
    }

    const now = Date.now();
    const elapsed = now - user.lastRefillTimestamp;
    const tokenToAdd = elapsed * REFILL_RATE;
  };
}
