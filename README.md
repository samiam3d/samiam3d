# samiam3d

Sam Gutierrez's art-direction and game-development portfolio, rebuilt as a v0-friendly Next.js App Router project.

The portfolio preserves the complete project order, written content, galleries, and video embeds from [samiam3d.com](https://samiam3d.com/). All 85 source images are stored in `public/assets/images`; the site does not depend on WordPress image hosting. Source URLs, hashes, byte sizes, and content types are recorded in `public/assets/asset-manifest.json`.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Local portfolio assets

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify a production build

```bash
npm run lint
npm run build
```

The repository is ready to import into v0 or deploy through Vercel's Git integration.

## Content and credits

Portfolio content and artwork belong to Sam Gutierrez. The complete WordPress source snapshot has been converted into local, static portfolio content for predictable v0 and Vercel rendering.
