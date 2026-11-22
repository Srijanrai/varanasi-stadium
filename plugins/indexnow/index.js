// Tells Bing (and other IndexNow engines) which pages changed, right after a production deploy goes live.
// ChatGPT search and Copilot draw on Bing's index, so this gets fresh facts into AI answers faster.
// It never fails a deploy: any problem is logged and skipped.

const KEY = "90944000f067492707e179a9ac2d43b6"; // public by design; the matching file is public/90944000f067492707e179a9ac2d43b6.txt
const HOST = "www.varanasistadiumguide.com";
const RECENT_DAYS = 3; // submit pages whose sitemap lastmod is this recent

module.exports = {
  async onSuccess({ utils }) {
    if (process.env.CONTEXT !== "production") return;
    try {
      const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
      const cutoff = Date.now() - RECENT_DAYS * 864e5;
      const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
        .map(([, block]) => ({
          loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
          lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
        }))
        .filter((u) => u.loc && u.lastmod && Date.parse(u.lastmod) >= cutoff)
        .map((u) => u.loc);
      if (!urls.length) return utils.status.show({ title: "IndexNow", summary: "No recently changed pages to submit." });
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
      });
      utils.status.show({ title: "IndexNow", summary: `Submitted ${urls.length} changed page(s): HTTP ${res.status}` });
    } catch (err) {
      console.log("IndexNow skipped:", err && err.message);
    }
  },
};
