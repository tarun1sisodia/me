This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare Workers (main2)

This branch deploys to Cloudflare Workers via the [OpenNext adapter](https://opennext.js.org/cloudflare). It uses its **own Worker named `me-main2`** (see `wrangler.jsonc`) so it never overwrites the `main` branch's Worker (`me`).

### Cloudflare dashboard setup (Workers Builds)

1. **Workers & Pages → Create → Worker → Import a repository** → pick `tarun1sisodia/me`.
2. Name the Worker **`me-main2`** (must match `name` in `wrangler.jsonc`) and select branch **`main2`** as the production branch.
3. Build settings:
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - **Root directory:** `/` (repo root)
4. Push to `main2` (or press **Retry build** on the latest build) to trigger a deployment. Changing the branch alone does not redeploy.
5. Open the Worker's own URL: `https://me-main2.<your-subdomain>.workers.dev`. The old `me.<your-subdomain>.workers.dev` URL belongs to the `main` branch and will keep showing the old UI.

### Local commands

```bash
npm run preview   # build + run locally in the Workers runtime
npm run deploy    # build + deploy to Cloudflare (requires wrangler login)
```
