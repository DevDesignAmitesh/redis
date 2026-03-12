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
  const { userId } = req.query as { userId: string | undefined };
  console.log("userId ", userId);

  const [top10, me] = await Promise.all([
    client.zRangeWithScores("users", 0, -1, {
      REV: true,
    }),
    client.zRankWithScore("users", userId ?? ""),
  ]);

  return res.status(200).json({
    top10,
    me,
  });
});

async function insertUsers(client: redisClient) {
  let users: { score: number; value: string }[] = [];

  const memebers = await client.zRange("users", 0, -1, {
    REV: true,
  });

  if (memebers.length === 0) {
    for (let i = 0; i < 100; i++) {
      users.push({
        score: Math.floor(Math.random() * 100),
        value: crypto.randomUUID(),
      });
    }

    client.zAdd("users", users);
  }
}

app.listen(PORT, () => console.log("code is running at ", PORT));
