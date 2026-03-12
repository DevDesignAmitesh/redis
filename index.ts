// page 1
// limit 10
// take = page * limit

import { createClient } from "redis";
import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

type redisClient = ReturnType<typeof createClient>;

const client = createClient();
await client.connect();

await insertUsers(client);

app.get("/", async (req, res) => {
  const { page, limit } = req.query as { page: string | undefined, limit: string | undefined };

  if(!page || !limit) {
    return res.status(404).json({
      message: "not found"
    })
  }

  const start = Number(page) * Number(limit);
  const end = start + Number(limit) - 1; 

  const users = await client.zRangeWithScores("users", start, end, {
    REV: true,
  });

  return res.status(200).json({
    users
  });
});

async function insertUsers(client: redisClient) {
  let users: { score: number; value: string }[] = [];

  const members = await client.zRange("users", 0, -1, {
    REV: true,
  });

  if (members.length === 0) {
    for (let i = 0; i < 100; i++) {
      users.push({
        score: Math.floor(Math.random() * 100),
        value: crypto.randomUUID(),
      });
    }

    await client.zAdd("users", users);
  }
}

app.listen(PORT, () => console.log("code is running at ", PORT));
