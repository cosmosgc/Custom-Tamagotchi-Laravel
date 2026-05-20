# Tamagotchi Maker — AGENTS.md

## Stack
- **Backend**: Laravel 11, PHP 8.3, MySQL 8
- **Frontend**: PixiJS 8 (canvas game) + Alpine.js + Tailwind + Vite (TypeScript)
- **Auth**: Laravel Breeze (Blade), session-based (no Sanctum tokens)

## Key Architecture

### Routes (ALL in `routes/web.php`)
- `/dashboard` — game canvas + sidebar, `auth` + `verified`
- `/api/*` — game data endpoints, **under `auth` middleware, NOT in api.php**
  - Since API routes are in `web.php`, they run through web middleware (sessions, CSRF)
  - CSRF is excluded for `api/*` paths via `bootstrap/app.php:$middleware->validateCsrfTokens(except: ['api/*'])`
  - PUT/POST/DELETE need `X-CSRF-TOKEN` header from `<meta name="csrf-token">`
- `/admin/*` — admin CRUD, `auth` + `admin` middleware
  - `is_admin` boolean column on `users` table
  - Admin middleware: `app/Http/Middleware/Admin.php`, aliased as `admin` in `bootstrap/app.php`

### Frontend (PixiJS 8)
- Entry: `resources/js/app.ts` (bootstraps Game, Renderer, SceneManager, MainScene)
- Game data (animations, dialogue, room templates, furniture catalog) is fetched from `/api/game-data/*` at runtime — NOT imported from JSON files
- Data flow: `app.ts` → `MainScene.init()` → fetch game data → create Room + Companion entities

### Game Entities (`resources/js/game/`)
- `entities/Companion.ts` — renders sprite, handles animation, emote, dialogue
- `entities/Room.ts` — room background, grid, furniture rendering + interaction
- `systems/` — NeedsSystem, InteractionSystem, IdleBehaviorSystem, MovementSystem, FurnitureSystem, etc.
- `state/GameStore.ts` — central game state (companion stats, room layout, inventory)

### DB Tables (custom)
- `companions`, `room_layouts`, `inventory_items`, `furniture_catalog`
- `companion_species`, `animation_configs`, `dialogue_lines`, `room_templates`

### Admin Panel
- CRUD at `/admin` for: species, animations, dialogue, rooms, furniture
- All use existing Breeze/Tailwind styling

### Deploy Quirks
- Served from subdirectory: `/tamagotchi-maker/public/`
- Asset URLs resolved via `<meta name="asset-url">` + `resolveAsset()`/`resolveApi()` in `resources/js/utils/config.ts`
- Vite `base` must be `/tamagotchi-maker/public/build/` in `vite.config.js` for dynamic imports (PixiJS workers)

## Commands
```sh
npm run build          # production build (Vite)
php artisan migrate    # run migrations
php artisan db:seed    # seed furniture catalog + game data from JSON defaults
php artisan optimize:clear  # clear all caches (routes, config, views)
```

## Conventions
- PixiJS 8: use `Container` for grouping, NOT `Graphics` as a group
- Companion sprite uses `spriteContainer` (flippable) inside `container` (not flipped) — dialogue/emotes go on `container`, not `spriteContainer`
- All API responses wrap data in `{ data: ... }`
- JSON game data files still exist at `resources/js/data/` but are only consumed by seeders — frontend fetches from DB via API
