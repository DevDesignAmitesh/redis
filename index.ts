import { createClient } from "redis";
import express from "express";
import { rateLimit } from "./redis-ratelimit";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", rateLimit(5, 10), (req, res) => {
  res.send("hello");
});

type redisClient = ReturnType<typeof createClient>;

// const client = createClient().connect();

app.listen(PORT, () => console.log("code is running at ", PORT));
