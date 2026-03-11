import { createClient } from "redis";

try {
  const client = await createClient().connect()

  await client.zAdd("set", [
    {
      score: 20,
      value: "a",
    },
    {
      score: 5,
      value: "b",
    },
    {
      score: 10,
      value: "c",
    },
  ]);

} catch (e) {
  console.log("error ", e)
}