import { createClient } from "redis";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", rateLimiter(5, 60), (req, res) => {
  res.send("hello");
});

type redisClient = ReturnType<typeof createClient>;

// const client = createClient().connect();

app.listen(PORT, () => console.log("code is running at ", PORT));

// user ip and number of re
const counter: Map<string, number> = new Map();
// user ip and req time
const timeFrame: Map<string, number> = new Map();

function rateLimiter(numOfReq: number, timeframeInSec: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip?.split("::ffff:")[1] ?? "11";

    if (!timeFrame.has(ip)) {
      const now = Date.now();
      timeFrame.set(ip, now + timeframeInSec * 1000);
    }

    if (counter.has(ip)) {
      const timeLimit = timeFrame.get(ip)!; // 03: 00
      const latestReqTime = Date.now(); // 03: 01
      console.log(latestReqTime >= timeLimit);

      if (latestReqTime >= timeLimit) {
        counter.set(ip, 1);
        const now = Date.now();
        timeFrame.set(ip, now + timeframeInSec * 1000);
        next();
      }

      const count = counter.get(ip)!;
      if (count >= numOfReq) {
        return res.status(429).json({
          message: "too many requests",
        });
      }
      const newNum = count + 1;
      counter.set(ip, newNum);
      next();
      return;
    }
    counter.set(ip, 1);
    next();
  };
}
