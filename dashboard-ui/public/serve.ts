import { serve } from "https://deno.land/std/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/mod.ts";

const s = serve("0.0.0.0:8080");

async function main() {
  for await (const req of s) {
    let url = req.url.substr(1);
    console.log(url);
    const txt = await readFileStr(url ? url : 'index.html');
    req.respond({ body: new TextEncoder().encode(txt)});
  }
}

main();
