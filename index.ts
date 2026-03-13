import { createClient } from "redis";
import express from "express";
import { tokenBucketRatelimiter } from "./token-bucket";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", tokenBucketRatelimiter(), (req, res) => {
  res.send("hello");
});

type redisClient = ReturnType<typeof createClient>;

// const client = createClient().connect();

app.listen(PORT, () => console.log("code is running at ", PORT));
