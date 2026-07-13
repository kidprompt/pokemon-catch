@../instruction/CLAUDE.md

# pokemon-catch

## Notes specific to this project

- A React (Vite + `@cloudflare/vite-plugin`) "Who's That Pokémon?" silhouette-guessing quiz, deployed as a Cloudflare Worker serving static assets (no backend/API, no `main` entry point in `wrangler.jsonc`).
- No sprite images are committed to the repo — `src/App.jsx` fetches Pokémon names from [PokeAPI](https://pokeapi.co/) at runtime and loads sprites directly from PokeAPI's public sprite CDN (`raw.githubusercontent.com/PokeAPI/sprites`), rendered as a black silhouette via CSS `filter: brightness(0)` until the player guesses. This keeps the repo asset-light but means the game needs network access to PokeAPI to work — there's no offline fallback.
- Covers the full National Pokédex, gens 1-9 (`POKEDEX_SIZE = 1025` in `App.jsx`, matching PokeAPI's current species count) — lower it if you want a more recognizable-names-only mode (e.g. `151` for Gen 1 only).
- `npm run dev` — local dev via Vite, Cloudflare-runtime-aware through the plugin.
- `npm run deploy` — builds (`vite build`) then `wrangler deploy`s the static assets.
