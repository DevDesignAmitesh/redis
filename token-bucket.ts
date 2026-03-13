import type { NextFunction, Request, Response } from "express";

const MAX_CAPACITY = 5;
let bucket = 0;

function refiller() {
  setInterval(() => {
    if (bucket >= MAX_CAPACITY) return;
    bucket += 3;
    console.log("bucket after adding adding ", bucket);
  }, 5 * 1000);
}

refiller();

export function tokenBucketRatelimiter() {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("bucket while req ", bucket);
    if (bucket === 0) {
      return res.status(429).json({
        message: "too many request",
      });
    }

    bucket -= 1;
    console.log("bucket after minus ", bucket);
    next();
  };
}
