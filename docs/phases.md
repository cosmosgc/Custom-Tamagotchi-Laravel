# Passive Companion Game Plan (PixiJS + Laravel)

## Vision

A web-first passive companion game where users own a personalized sona/fursona companion.

The game combines:

* Tamagotchi-style care systems
* Passive idle simulation
* Optional active gameplay/minigames
* Social connectivity
* Persistent cloud saves
* Commission-based custom characters

The engine must be:

* modular
* data-driven
* scalable
* easy to customize for commissions

---

# Core Philosophy

## Passive First

The companion should feel alive even without active gameplay.

Examples:

* idle animations
* mood changes
* sleeping
* random actions
* dynamic dialogue
* notifications
* affection systems

---

## Active Optional

Gameplay enhances the experience but is not mandatory.

Examples:

* minigames
* exploration
* decorating rooms
* collecting items
* seasonal events

---

# Tech Stack

## Backend

### Laravel API

Responsibilities:

* authentication
* save data
* inventories
* companion data
* item definitions
* social systems
* event systems
* admin dashboard
* commission management

Recommended:

* Sanctum
* MySQL/PostgreSQL
* Redis later if needed

---

## Frontend

### PixiJS

Responsibilities:

* rendering
* animations
* effects
* character layering
* room rendering
* interactions

---

## Frontend UI

Recommended:

* Vite
* TypeScript
* TailwindCSS
* AlpineJS or Vue

---

# High Level Architecture

```text
Frontend
├── PixiJS Renderer
├── UI Layer
├── State Manager
├── Interaction Systems
├── Networking/API Client
├── Audio System
└── Save Sync

Backend
├── Auth API
├── Companion API
├── Save API
├── Inventory API
├── Social API
├── Notification API
└── Admin Dashboard
```

---

# DEVELOPMENT PHASES

# PHASE 1 — FOUNDATION

Goal:
Create the technical groundwork.

Estimated:
2–5 days

---

## Tasks

### Setup Frontend Project

Create frontend app:

* Vite
* TypeScript
* PixiJS
* TailwindCSS

Structure:

```text
frontend/
├── src/
├── assets/
├── game/
├── ui/
├── api/
└── systems/
```

---

### Create Laravel API Structure

Setup:

* Sanctum auth
* API routes
* CORS
* user endpoints

Endpoints:

* login
* register
* profile
* save/load

---

### Create Basic PixiJS Renderer

Tasks:

* initialize renderer
* resize handling
* render loop
* asset loading
* scene management

---

### Create Game State System

Need:

* global game state
* player state
* companion state
* inventory state

Recommended:

* Zustand-like architecture
* simple custom store

---

### Create Data-Driven Definitions

Create JSON-driven systems:

```text
data/
├── items/
├── companions/
├── rooms/
├── animations/
└── dialogue/
```

---

# PHASE 2 — COMPANION CORE

Goal:
Make the companion feel alive.

Estimated:
1–2 weeks

---

## Tasks

### Companion Entity System

Create:

* stats
* moods
* needs
* energy
* hunger
* affection

---

### Idle Behavior System

Companion should:

* walk around
* sleep
* react
* emote
* randomly animate

---

### Animation System

Need:

* sprite animation
* layered sprites
* expression system
* accessory layers

---

### Time Simulation

Implement:

* offline progression
* sleeping schedules
* timed decay

---

### Interaction System

Player can:

* pet
* feed
* clean
* play
* talk

---

### Dialogue System

Data-driven dialogue.

Example:

```json
{
  "mood": "happy",
  "text": "I'm glad you're here!"
}
```

---

# PHASE 3 — ROOM SYSTEM

Goal:
Create the living space.

Estimated:
1 week

---

## Tasks

### Room Rendering

Need:

* background
* furniture layers
* interactables

---

### Furniture Placement

Allow:

* move
* rotate
* place

---

### Companion Navigation

Companion should:

* walk to objects
* sit
* sleep in bed
* interact with furniture

---

### Decoration Save System

Persist:

* room layout
* item placement

---

# PHASE 4 — INVENTORY & ITEMS

Goal:
Create progression systems.

Estimated:
1 week

---

## Tasks

### Item Database

Categories:

* food
* toys
* cosmetics
* furniture
* gifts

---

### Inventory UI

Need:

* drag/drop
* stack support
* categories

---

### Item Effects

Examples:

* food restores hunger
* toy increases happiness
* cosmetics change appearance

---

# PHASE 5 — CHARACTER CUSTOMIZATION

Goal:
Enable commissions.

Estimated:
2 weeks

---

## Tasks

### Modular Sprite System

Support:

* body
* eyes
* mouth
* accessories
* clothing

---

### Character Import Pipeline

Need:

* asset manifest
* animation definitions
* validation tools

---

### Character Definition JSON

Example:

```json
{
  "species": "fox",
  "colors": {
    "fur": "#ff9900"
  },
  "animations": {
    "idle": "idle.json"
  }
}
```

---

### Admin Upload Tools

Web dashboard for:

* uploading assets
* configuring animations
* testing expressions

---

# PHASE 6 — ACTIVE GAMEPLAY

Goal:
Add optional gameplay loops.

Estimated:
2–4 weeks

---

## Tasks

### Minigame Framework

Create reusable systems.

Possible minigames:

* fishing
* rhythm game
* cleaning game
* memory game
* arcade game

---

### Reward Systems

Rewards:

* items
* currency
* affection
* cosmetics

---

### Daily Tasks

Examples:

* feed companion
* clean room
* play together

---

# PHASE 7 — ONLINE FEATURES

Goal:
Social connectivity.

Estimated:
2–4 weeks

---

## Tasks

### Friend System

Need:

* add friend
* friend list
* statuses

---

### Companion Visits

Users can:

* visit rooms
* send gifts
* leave messages

---

### Live Presence

Optional:

* online indicators
* realtime events

Use:

* polling initially
* websocket later

---

### Notifications

Examples:

* companion hungry
* gift received
* event active

---

# PHASE 8 — COMMISSION PIPELINE

Goal:
Turn the engine into a business.

Estimated:
ongoing

---

## Tasks

### Character Builder Workflow

Need:

* intake form
* references upload
* trait selection
* personality setup

---

### Asset Packaging

Commission export format:

```text
character_package/
├── sprites/
├── sounds/
├── animations/
├── config.json
└── metadata.json
```

---

### Internal Tooling

Build tools for:

* previewing animations
* validating assets
* testing companion behavior

---

# PHASE 9 — LIVE SERVICE

Goal:
Retention and monetization.

Estimated:
ongoing

---

## Tasks

### Events

Examples:

* holidays
* birthdays
* weather
* festivals

---

### Seasonal Items

Need:

* rotation system
* event shop

---

### Analytics

Track:

* retention
* interactions
* popular items

---

# IMPORTANT ENGINE RULES

# 1 — EVERYTHING MUST BE DATA DRIVEN

Avoid hardcoded logic.

Use:

* JSON
* definitions
* registries

---

# 2 — KEEP SYSTEMS MODULAR

Never tightly couple:

* rendering
* gameplay
* networking
* saves

---

# 3 — PRIORITIZE CONTENT PIPELINE

Your real bottleneck will be:

* importing assets
* configuring animations
* building custom companions

NOT programming.

---

# 4 — DO NOT OVERBUILD MULTIPLAYER EARLY

Start with:

* polling
* API sync

Realtime later.

---

# RECOMMENDED MVP

Build ONLY this first:

## MVP Features

* login
* one room
* one companion
* idle animations
* hunger/energy/fun
* pet/feed/play
* inventory
* cloud save

That is enough to:

* test retention
* show prototypes
* start commissions

---

# RECOMMENDED FILE STRUCTURE

```text
frontend/
├── assets/
├── data/
├── game/
│   ├── entities/
│   ├── scenes/
│   ├── systems/
│   ├── ui/
│   └── rendering/
├── api/
└── utils/
```

---

# Suggested First Week

## Day 1

* PixiJS setup
* Laravel auth API

## Day 2

* Render character sprite
* Basic scene

## Day 3

* Idle animation
* Needs system

## Day 4

* Interaction buttons
* API save/load

## Day 5

* Inventory
* Basic room

## Day 6

* Offline progression

## Day 7

* Polish + refactor

---

# Long-Term Potential

This can evolve into:

* social virtual pet platform
* VTuber companion app
* streamer widget
* RP ecosystem
* collectible character platform
* creator marketplace

The important thing:
start VERY small and make the companion emotionally appealing as early as possible.
