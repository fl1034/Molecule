# Molecular Explorer

A full-screen molecular viewer with a minimal right-hand list, Import, and Screenshot. Nine bundled experimental structures: hemoglobin, DNA, nucleosome, GFP, lysozyme, tRNA, myoglobin, rhodopsin, and F1-ATPase. No account, backend or AI key required.

Select a molecule from the list. Drag to rotate and scroll/pinch to zoom. Hover over the structure to see its type, molecule name, author chain, and residue range. Clicking selects the entire annotated helix or beta strand (or one residue for other features). Click again, click empty space, or press Esc to clear. Import accepts local `.cif`, `.mmcif`, `.pdb`, or `.ent` files (up to 50 MB each). Valid imports are added to the list and retained in this browser's IndexedDB; clearing site data removes them. Files are processed locally and are not uploaded. Imported structures use the first model and Molstar's automatic representation. Screenshot downloads a PNG of the molecular view without UI controls.

## Run

Tested with Node 24.19.0 and npm 11.9.0.

```sh
cd /workspace/Molecule
npm ci
npm run dev
```

Open the address printed by Vite.

```sh
npm run build
npm run preview
npx playwright install chromium
node tests/browser.mjs
```

The browser test expects the dev server on port 5173. It uses software WebGL for cloud machines. Serve `dist/` using any static HTTP host. Vite uses a relative base, so the entire directory can be mounted under a subpath (use a trailing slash). There are no client-side routes. Source assets are bundled, not fetched from RCSB at runtime.

See [engine integration](docs/ENGINE.md), [data provenance](docs/provenance.json), [attribution](docs/ATTRIBUTION.md), and [validation](docs/VALIDATION.md). The screenshots in `docs/` show the tested desktop and mobile layouts.

This prototype presents static experimental coordinates. It does not simulate molecular motion, predict folding, or provide AI answers. The JavaScript bundle is about 0.9 MB gzip; optimization and broader device testing remain future work.

## GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`: Node 24, `npm ci`, production build, Pages artifact upload and deployment. The repository's Pages source must be GitHub Actions. The configured site address is https://fl1034.github.io/Molecule/ .

Import and Screenshot are separate icon buttons with hover/focus labels and accessible names. The viewer and exported image background use dark grey (#242424).
