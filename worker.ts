import { createClient } from "redis";

const client = await createClient().connect()

const res = await client.zRange("set", 0, -1, {
  REV: true
});

await client.zIncrBy("set", 40, res[2]!)

const res2 = await client.zRangeWithScores("set", 0, -1, {
  REV: true
});

console.log(res2)
