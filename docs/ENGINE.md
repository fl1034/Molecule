# Engine integration

Molstar **5.13.1**, an exact npm release dependency with integrity hashes in package-lock.json. Vite 7.3.1 and TypeScript 5.9.3. No development-branch checkout or wrapper is used. The direct PluginContext API keeps the museum UI independent of the advanced scientific UI.

Verified against the installed release's TypeScript declarations and implementation:

- `PluginContext(DefaultPluginSpec())`, `init()`, `initViewerAsync(canvas, container)` initialize one canvas.
- `builders.data.download`, `parseTrajectory('mmcif')`, `createModel({modelIndex:0})`, and `createStructure({name:'model'})` load deposited coordinates without assembly expansion.
- `tryCreateComponentFromExpression` uses MolScript atomGroups and explicit author chain/residue identifiers. Water is excluded. Every component must have positive elementCount before loading succeeds.
- `representation.addRepresentation` creates cartoon or ball-and-stick representations and uniform component colors.
- `setSubtreeVisibility`, `camera.focusSphere` implement isolation and narrated stops. Stops reset all component visibility. Immediate viewpoint changes respect reduced-motion preferences.
- `behaviors.interaction.click` and `lociLabel` provide labels from the actual picked loci. HTML markup is converted to text before display.
- `clear()` replaces the old state; `dispose()` releases the plugin on page exit.

Architecture: `src/stories.ts` owns content/selectors; `src/adapter.ts` owns Molstar; `src/main.ts` serializes loads with a revision counter. Obsolete queued loads are skipped and obsolete completed loads cannot update UI. Controls are disabled while loading. One plugin and canvas are reused.

References: https://github.com/molstar/molstar/tree/v5.13.1 and https://molstar.org/viewer-docs/ . The installed package is the API authority for this implementation.

Selection namespace: auth_asym_id and auth_seq_id, plus label_comp_id. Model index 0. No assembly-generated copies. Heme A142 is HEM (43 atoms); DNA pair A6 DA / B19 DT contains 41 atoms. No insertion codes occur in these detailed selected residues. Polymer cartoons suppress non-polymer atoms, while heme is separately represented.

Expanded collection: `src/additional-stories.ts` supplies six more typed stories. Categories and numbering in the existing story grid now derive from story data, preserving the original visual layout. Build validation checks all nine coordinate hashes and all 36 stop references. All files remain local at runtime.

## Minimal viewer revision

The active UI is now only the full-viewport canvas and a right-side molecule list, Import, and Screenshot. Story metadata remains as source data, but narration and tour controls are no longer displayed. Bundled entries use their overview scene. Imported PDB/mmCIF data passes through `rawData`, `parseTrajectory`, first-model creation, and the `auto` representation preset; only valid, nonempty structures are saved to IndexedDB and added to the list. `viewportScreenshot.download` renders the molecular image through Molstar's screenshot pass, excluding HTML controls. Camera axes are disabled.

## Structural selection

`src/selection.ts` maps picked loci back to the loaded root structure, preserving the unit/instance and chain. It uses Molstar's attached secondary-structure assignment (falling back to deposited model annotations), not geometry guessed from colors. Alpha, 3₁₀ and pi helices are distinguished; beta strands include the sheet ID when available. A helix/strand selection includes its atoms in the picked chain and unit. Other features select one residue, and DNA/RNA/ligands are not labeled as protein secondary structure. Unassigned peptide residues are labeled coil/unassigned. The prompt uses the deposited entity name and author residue numbering with insertion codes.

Default highlight, selection and focus click behaviors are replaced by one adapter-owned implementation. Hover uses a 100 ms pointer-pause debounce and Molstar’s coordinate picking API; persistent click selection and hover use Molstar canvas marker actions. This avoids stalled asynchronous hover reads observed in the cloud software WebGL renderer. Esc, repeat click, background click and structure replacement clear selection. The transient prompt uses textContent and remains inside viewport bounds. No permanent controls were added.
