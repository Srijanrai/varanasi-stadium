# AEO checklist: getting quoted by AI answer engines

## One-time setup (owner)

1. **Bing Webmaster Tools** → Sign in → *Import from Google Search Console* → pick varanasistadiumguide.com. ChatGPT search and Copilot draw on Bing's index.
2. After the first production deploy with `netlify.toml`, check the deploy log for an **IndexNow** line ("Submitted N changed page(s): HTTP 200" or 202). The key file is in `public/`; don't delete it.

## How freshness reaches AI engines

- Every deploy submits pages whose sitemap date changed in the last 3 days to IndexNow (Bing, Yandex and others).
- Stadium pages take their date from `lastChecked` in `content/stadium.json`; listings from `updatedAt`. **Update these whenever facts change**, or the change won't be announced.

## Monthly prompt check (15 minutes)

Ask each in ChatGPT (search on), Perplexity and Gemini. Note whether varanasistadiumguide.com is cited, and whether the answer is correct.

English:
1. When will the Varanasi cricket stadium open?
2. Is there any match at the Varanasi stadium?
3. How far is the Ganjari stadium from Varanasi Cantt station?
4. How do I reach the Varanasi international cricket stadium?
5. Are Varanasi stadium tickets on sale?
6. Kashi Vishwanath temple opening and closing time
7. Kashi Vishwanath VIP darshan ticket price
8. Is mobile allowed in Kashi Vishwanath temple?

Hindi:
9. वाराणसी स्टेडियम में मैच कब है?
10. गंजारी स्टेडियम कैसे पहुँचें?
11. काशी विश्वनाथ मंदिर खुलने का समय
12. वाराणसी क्रिकेट स्टेडियम कब खुलेगा?

| Month | Prompts citing us (of 12) | Wrong answers seen | Notes |
|---|---|---|---|
| Dec 2026 | | | |

## Also watch

- **Cloudflare Web Analytics → Referrers:** chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com.
- If an AI engine gives a wrong answer that our page gets right, check that page's first sentence answers the question on its own.
