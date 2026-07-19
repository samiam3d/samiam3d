# samiam3d

A faithful, self-contained static replica of [samiam3d.com](https://samiam3d.com/), preserving the complete portfolio content, project order, galleries, video embeds, header behavior, navigation drawer, and contact drawer.

All displayed portfolio images are stored locally in `public/assets/images`; the built site does not hotlink images from the WordPress installation. Source-to-local mappings, hashes, byte sizes, and content types are recorded in `public/assets/asset-manifest.json`.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The generated site is written to `dist/`.

## Refresh from the source site

```bash
npm run sync
```

The sync script downloads the current public homepage, keeps the original portfolio markup and ordering, selects the highest-resolution source for each displayed image, localizes the theme styles and fonts, strips WordPress runtime and analytics scripts, and rebuilds the asset manifest.

## Source and credits

Portfolio content and artwork are mirrored from `samiam3d.com`. The visual foundation is the WordPress **Eighties** theme by Kopepasah; the original credit remains in the site footer.
