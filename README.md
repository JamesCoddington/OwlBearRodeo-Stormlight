# Stormlight Character Sheet — OwlBear Rodeo Extension

A fully-featured digital character sheet for the **Stormlight Archive RPG**, built as a plugin for the [OwlBear Rodeo](https://www.owlbear.rodeo/) virtual tabletop platform. It runs as a popover in the OBR toolbar and syncs character data across all players via the OBR SDK. It can also be run standalone in any browser using localStorage only.

---

## Commands

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start the Vite development server (hot reload) |
| `npm run build` | Compile TypeScript and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for testing |

> **Note:** To load the extension in OwlBear Rodeo, point OBR to the URL of your running dev server or host the contents of `dist/` at a publicly accessible URL, then add it as an extension.

---

## Tech Stack

| Tool | Role |
|---|---|
| [TypeScript ~5.9](https://www.typescriptlang.org/) | Primary language (strict mode, ESNext target) |
| [Vite 8](https://vitejs.dev/) | Dev server and production bundler |
| [Lightning CSS](https://lightningcss.dev/) | CSS processing |
| [OwlBear Rodeo SDK 3.1](https://docs.owlbear.rodeo/extensions/getting-started) | OBR integration (player metadata, party, roles) |
| Vanilla DOM / TypeScript | UI — no framework, components are plain functions returning `HTMLElement` |

---

## App Structure Walkthrough

The app is divided into three top-level tabs. Below is a diagram of the full layout:

```
┌─────────────────────────────────────────────────┐
│                     HEADER                      │
│  [Character Name]  Level [##]  [↑ Import] [↓ Export] │
│  Paths: ________  Ancestry: _______  Player: __ │
├─────────────────────────────────────────────────┤
│  ★ Mine  │  Player 1  │  Player 2  │  ...       │  ← GM Only
├──────────┬──────────────────────────────────────┤
│  Stats   │  Details   │  Radiant                │  ← Tab Bar
├──────────┴──────────────────────────────────────┤
│                                                 │
│              Active Tab Content                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Header

Present on every tab. Contains:

- **Character Name** — displayed prominently at the top
- **Level** — numeric level input
- **Import / Export** — load a `.json` character file or download the current sheet as `.json`
- **Paths, Ancestry, Player Name** — secondary identity fields below the name

---

### GM Bar *(OwlBear Rodeo only)*

When the logged-in user is a GM, a player switcher bar appears below the header. It contains:

- **★ Mine** — return to the GM's own sheet
- **[Player Name] buttons** — click to view another player's sheet in read-only mode

Party membership updates in real time as players join or leave.

---

### Tab: Stats

The mechanical core of the character. Organized into the following sections:

```
┌─────────────────────────────────────────────────┐
│ ATTRIBUTES                                       │
│  ┌────────────┬────────────┬────────────┐        │
│  │ PHYSICAL   │ COGNITIVE  │ SPIRITUAL  │        │
│  │ Strength   │ Intellect  │ Awareness  │        │
│  │ Speed      │ Willpower  │ Presence   │        │
│  │ Phys Def*  │ Cog Def*   │ Spr Def*   │        │
│  └────────────┴────────────┴────────────┘        │
│  * Auto-calculated: (stat1 + stat2 + 10)         │
├─────────────────────────────────────────────────┤
│ RESOURCES                   [current] / [max]    │
│  Health      ████████░░░░░░░░░░░░░░░░░░░░        │
│  Focus       ████░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Investiture ██████████░░░░░░░░░░░░░░░░░░        │
│  Deflect     [##]                                │
├─────────────────────────────────────────────────┤
│ SKILLS                                           │
│  Physical  │ Cognitive  │ Spiritual   │ Custom   │
│  Agility   │ Crafting   │ Deception   │ [user]   │
│  Athletics │ Deduction  │ Insight     │ [user]   │
│  Heavy Wpn │ Discipline │ Leadership  │ [user]   │
│  Light Wpn │ Intimidate │ Perception  │          │
│  Stealth   │ Lore       │ Persuasion  │          │
│  Thievery  │ Medicine   │ Survival    │          │
│                                                  │
│  Each skill: Ranks (auto) ○○○○○ Bonus ★★★ Total │
├─────────────────────────────────────────────────┤
│ DERIVED STATS (editable)                         │
│  Lifting Capacity │ Movement │ Recovery Die      │
│  Senses Range                                    │
├─────────────────────────────────────────────────┤
│ ▼ EXPERTISES         [+ Add]                     │
│   • [Type] ×                                     │
├─────────────────────────────────────────────────┤
│ ▼ CONDITIONS         [+ Add]                     │
│   • [Type] [Time] [Description] ×                │
├─────────────────────────────────────────────────┤
│ ▼ WEAPONS            [+ Add]                     │
│   • [Name] [Skill] [Damage] [Traits] ×           │
├─────────────────────────────────────────────────┤
│ ▼ TALENTS            [+ Add]                     │
│   • [Name] [Description] ×                       │
└─────────────────────────────────────────────────┘
```

**Attribute Auto-Calculation:**
- Physical Defense = Strength + Speed + 10
- Cognitive Defense = Intellect + Willpower + 10
- Spiritual Defense = Awareness + Presence + 10

**Skill Ranks:**
- Base ranks are linked to the associated attribute (capped at 5)
- Players add Bonus Ranks (○ pips, up to 5) and Star Ranks (★ pips, up to 3)
- Total = base + bonus + stars

**Resource Caps (auto-enforced):**
- Focus max capped at `2 + Willpower`
- Investiture max capped at `2 + max(Awareness, Presence)`

**Collapsible Sections** (Expertises, Conditions, Weapons, Talents) can be toggled open/closed and each support adding and removing list entries.

---

### Tab: Details

Character narrative and background information:

```
┌─────────────────────────────────────────────────┐
│ APPEARANCE                                       │
│  [textarea]                                      │
├─────────────────────────────────────────────────┤
│ PURPOSE & GOALS                                  │
│  Purpose:  [textarea]                            │
│  Obstacle: [textarea]                            │
│  Goals:    [goal text]  ○○○  ← progress bubbles  │
│            [goal text]  ○○○                      │
│            [+ Add Goal]                          │
├─────────────────────────────────────────────────┤
│ OTHER TALENTS & ABILITIES                        │
│  [textarea]                                      │
├─────────────────────────────────────────────────┤
│ ARMOR & EQUIPMENT                                │
│  [textarea]                                      │
├─────────────────────────────────────────────────┤
│ MARKS       NOTES       CONNECTIONS              │
│  [textarea] [textarea]  [textarea]               │
└─────────────────────────────────────────────────┘
```

Goals support 0–3 progress bubbles that players click to track completion.

---

### Tab: Radiant

Stormlight-specific mechanics for Radiant characters:

```
┌─────────────────────────────────────────────────┐
│ IDEALS                                           │
│  Radiant Order: [text field]                     │
│  1st Ideal: "Life before death. Strength         │
│              before weakness. Journey before     │
│              destination."  (locked)             │
│  2nd Ideal: [editable]                           │
│  3rd Ideal: [editable]                           │
│  4th Ideal: [editable]                           │
│  5th Ideal: [editable]                           │
├─────────────────────────────────────────────────┤
│ SPREN                                            │
│  Name: [text]   Bond Range: [text]               │
│  Personality: [textarea]                         │
├─────────────────────────────────────────────────┤
│ SURGES                                           │
│  ┌─────────────────┐  ┌─────────────────┐        │
│  │ SURGE 1         │  │ SURGE 2         │        │
│  │ Name:           │  │ Name:           │        │
│  │ Effect:         │  │ Effect:         │        │
│  │ Activation:     │  │ Activation:     │        │
│  │ Mod / Size / Die│  │ Mod / Size / Die│        │
│  │ Talents: [list] │  │ Talents: [list] │        │
│  └─────────────────┘  └─────────────────┘        │
├─────────────────────────────────────────────────┤
│ STORMLIGHT ACTIONS (reference, read-only)        │
│  Enhance │ Breathe Stormlight │ Regenerate       │
│                                                  │
│ SPREN ACTIONS (reference, read-only)             │
│  Covert Scouting │ Oath Encouragement │ ...      │
└─────────────────────────────────────────────────┘
```

The **Actions** section is a static reference table — no editing required — listing the standard Stormlight/Spren actions available to Radiant characters.

---

## State & Persistence

The app uses a simple pub/sub **Store** (`src/state/store.ts`) to hold the current `CharacterSheet`. All components subscribe to the store and re-render when relevant data changes.

**Dual-storage strategy:**

| Storage | Key | When used |
|---|---|---|
| `localStorage` | `stormlight-character-[playerId]` | Always (local, instant) |
| OBR Player Metadata | `com.stormlight-sheet/character` | OBR mode only (cloud sync) |

On load, whichever copy has a newer timestamp wins. Auto-saves are debounced:
- **localStorage:** 500ms after last change
- **OBR Metadata:** 2000ms after last change

---

## Import / Export

Characters can be exported to a `.json` file and imported back via the header buttons. This allows sharing sheets between players, backing up data, or migrating to a new device. The import applies a **migration step** that converts any legacy string fields to the current structured format automatically.

---

## Running Without OwlBear Rodeo

The app detects whether it's inside OBR by waiting for `OBR.onReady()` with a 1-second timeout. If OBR is not detected, it falls back to **standalone mode** — all features work except party viewing and cloud sync. Data is saved to `localStorage` only. This is the default experience when running `npm run dev` and opening `http://localhost:5173` in a browser.

---

## Project Structure

```
src/
├── main.ts                  # Entry point; OBR detection + app bootstrap
├── app.ts                   # Root layout: tabs, GM bar, page routing
├── models/
│   ├── character.ts         # TypeScript interfaces for all sheet data
│   └── defaults.ts          # Default blank character sheet
├── state/
│   ├── store.ts             # Pub/sub reactive store
│   ├── persistence.ts       # Load/save to localStorage + OBR metadata
│   └── party.ts             # GM: fetch and watch party members
├── components/
│   ├── header.ts            # Top bar (name, level, import/export)
│   ├── tabs.ts              # Tab navigation
│   ├── gm-player-tabs.ts    # GM player switcher bar
│   ├── stats/               # Stats tab components
│   │   ├── stats-page.ts
│   │   ├── attributes.ts
│   │   ├── resources.ts
│   │   ├── skills.ts
│   │   ├── derived.ts
│   │   ├── weapons.ts
│   │   ├── talents.ts
│   │   └── conditions.ts
│   ├── details/             # Details tab components
│   │   ├── details-page.ts
│   │   ├── appearance.ts
│   │   ├── goals.ts
│   │   ├── equipment.ts
│   │   └── notes.ts
│   ├── radiant/             # Radiant tab components
│   │   ├── radiant-page.ts
│   │   ├── ideals.ts
│   │   ├── spren.ts
│   │   ├── surges.ts
│   │   └── stormlight-actions.ts
│   └── shared/              # Reusable UI primitives
│       ├── collapsible.ts
│       ├── editable-field.ts
│       ├── textarea-field.ts
│       ├── list-field.ts
│       ├── number-input.ts
│       └── resource-bar.ts
├── utils/
│   ├── dom.ts               # el() helper for DOM element creation
│   └── debounce.ts          # Debounce utility for auto-save
└── styles/
    ├── theme.css            # CSS variables, color palette, typography
    ├── layout.css           # Page/grid layouts
    ├── components.css       # Shared component styles
    ├── stats.css            # Stats tab styles
    ├── details.css          # Details tab styles
    └── radiant.css          # Radiant tab styles
```
