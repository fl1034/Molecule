# Prototype validation — 2026-10-30

Executed in the cloud workspace:

- `npm run build`: TypeScript and production build passed. Build-time story references and unchanged asset SHA-256 checks also passed via `node scripts/validate.mjs`.
- `node tests/browser.mjs`: Chromium software WebGL rendered all three structures. Four forward transitions per story, every component isolate/restore, overview, and rapid switching completed. All non-local requests were blocked. No uncaught page errors. Desktop 1440px and mobile 390px screenshots saved; no mobile horizontal overflow.
- Actual loaded selection counts: 4HHB alpha 2224, beta 2334, heme A142 43; 1BNA strand A 243, strand B 243, central pair 41; 1AOI DNA 5986, histone core 6386 atoms. Counts include non-water atoms matching selectors; cartoon representations render polymer geometry.
- `node tests/production.mjs`: production assets served at `/demo/`, direct load and reload passed; real picking returned `4HHB | Model 1 | Instance 1_555 | C | LYS 60`. A simulated 404 for 1BNA produced a readable error and selecting the story again recovered.
- Inspected desktop rendering visually. Data metadata, detailed residue identities, file hashes, and RCSB CC0 policy checked.

Production test reproduction: copy dist into `/tmp/molecule-public/demo/`, serve `/tmp/molecule-public` on localhost port 4174, then run `node tests/production.mjs`.

Limitations: not independently reviewed by a structural biologist; not tested on physical mobile devices or every browser. Camera focus is immediate and retains user orientation, rather than prescribing a canonical rotation at each stop. Representations are curated per component, with no general representation editor. No AI or live deployment. The engine bundle produces Vite's large-chunk advisory (~892 KB gzip); this does not fail the build. Keyboard controls operate tours and isolation; free orbit is pointer/touch based.

## Expanded collection — 2026-10-30

The production build now validates nine stories and 36 stops. Six new files have matching recorded SHA-256 hashes. Official RCSB entry metadata and the detailed author residue identifiers were checked against the downloaded data.

Browser-resolved component counts for the additions:

| Entry | Components (selected atoms) |
| --- | --- |
| 1EMA | Protein 1771; CRO A66 22; ARG A96 11 |
| 1LYZ | Protein 1001; GLU A35 9; ASP A52 8 |
| 1EHZ | RNA selection 1661; anticodon A34–36 68; CCA A74–76 62 |
| 1MBN | Chain A 1260; heme A155 43 |
| 1F88 | Chain A 2663; chain B 2454; retinal A977 20 |
| 1BMF | Alpha selections 11274; beta selections 10659; gamma 945; ADP/ANP 151 |

Counts describe selectors, not just visible cartoon atoms: a chain selection can include non-water ligands or ions with the same author chain ID. Cartoon rendering displays the polymer; explicit ball-and-stick components display the selected ligands.

Expanded `node tests/browser.mjs` completed with exit code 0 and no uncaught page errors: all nine structures, all tour transitions, every component isolation/restoration, rapid switching, and 390px mobile overflow checks passed with external requests blocked. Updated desktop/mobile screenshots were saved; the nine-card desktop grid was visually inspected.

## Full-screen viewer revision

The earlier tour UI checks describe the previous interface. The current UI contains only the full-screen molecular canvas, molecule list, Import and Screenshot.

Passed: TypeScript/production build; all nine molecule selections; mmCIF import; imported-list persistence after reload; rejection of an invalid file without adding it to the list; recovery to a valid structure; PNG download (visually inspected to confirm molecular rendering without controls); PDB import using coordinates converted from the bundled 1BNA fixture; production subpath reload and missing-file recovery. Browser checks ran in Chromium with software WebGL. The desktop screenshot was inspected. A ResizeObserver now updates Molstar's drawing buffer on viewport changes; a 390×844 resize was verified to produce a matching drawing buffer and visible molecule.

Imports are local to the browser origin and depend on IndexedDB storage availability; files are capped at 50 MB. No server upload or format conversion UI is provided. Narrow-screen controls overlay part of the molecular view; users can rotate, pan and zoom. The camera viewport fills the entire screen.

## Structural hover and click selection

`npm run build` passed. `node tests/selection.mjs` passed in Chromium software WebGL: hovered and selected a real alpha helix (hemoglobin alpha subunit, author chain C, residues 36–42), a beta strand (GFP, sheet A, chain A, residues 25–36), and identified a DNA nucleotide (chain B, DG22). Esc and background-click clearing passed with no uncaught browser errors. Screenshots `selection-alpha.png` and `selection-beta.png` were visually inspected: the selected complete secondary-structure segment is highlighted and the transient prompt identifies its type, entity name, and author range. DNA is not misclassified as protein secondary structure.

Helix/strand boundaries come from Molstar's assigned/deposited secondary structure. A strand highlight is a single annotated segment, not every strand in a sheet; an alpha helix is not the entire alpha protein subunit. Where assignments are unavailable, the UI reports coil/unassigned rather than inventing a helix/sheet name.
