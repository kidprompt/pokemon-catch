@../instruction/CLAUDE.md

# pokemon-catch

## Notes specific to this project

- A React (Vite + `@cloudflare/vite-plugin`) "Who's That Pokémon?" silhouette-guessing quiz, deployed as a Cloudflare Worker serving static assets (no backend/API, no `main` entry point in `wrangler.jsonc`).
- No sprite images are committed to the repo — `src/App.jsx` fetches Pokémon names from [PokeAPI](https://pokeapi.co/) at runtime and loads sprites directly from PokeAPI's public sprite CDN (`raw.githubusercontent.com/PokeAPI/sprites`), rendered as a black silhouette via CSS `filter: brightness(0)` until the player guesses. This keeps the repo asset-light but means the game needs network access to PokeAPI to work — there's no offline fallback.
- Limited to the first 151 (Gen 1) Pokédex entries (`POKEDEX_SIZE` in `App.jsx`) so names stay recognizable to most players — raise it if targeting a more dedicated audience.
- `npm run dev` — local dev via Vite, Cloudflare-runtime-aware through the plugin.
- `npm run deploy` — builds (`vite build`) then `wrangler deploy`s the static assets.
