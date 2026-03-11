import { createClient } from "redis";

try {
  const client = await createClient().connect();

  // await client.zAdd("set", [
  //   {
  //     score: 20,
  //     value: "a",
  //   },
  //   {
  //     score: 5,
  //     value: "b",
  //   },
  //   {
  //     score: 10,
  //     value: "c",
  //   },
  // ]);

  // const res = await client.zRange("set", 0, -1, {
  //   REV: true
  // });

  // await client.zIncrBy("set", 40, res[2]!)

  // const res2 = await client.zRangeWithScores("set", 0, -1, {
  //   REV: true
  // });

  // console.log(res2)

  const start = Date.now();
  const inMemProd = JSON.parse(await client.get("products") ?? "[]") as Product[];
  let products: Product[] = []
  console.log("inMemProd", inMemProd.length)
  
  if(inMemProd.length === 0) {
    products = await fetchFromDb()
    console.log("db prod", products.length)
    await client.set("products", JSON.stringify(products), {
    })
    await client.expire("products", 60)
  } else {
    products = inMemProd
  }

  
  const end = Date.now();
  console.log(products)
  console.log("final prod", products)
  console.log("end ", end - start);
} catch (e) {
  console.log("error ", e);
}

interface Product {
  id: string;
  name: string;
}

async function fetchFromDb() {
  return new Promise<Product[]>((res, rej) =>
    setTimeout(
      () =>
        res([
          {
            id: crypto.randomUUID(),
            name: "shirts",
          },
          {
            id: crypto.randomUUID(),
            name: "pants",
          },
        ]),
      3000,
    ),
  );
}
