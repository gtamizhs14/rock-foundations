# Rock Foundations ⛪

> A church-grade UI component library built to align with Rock RMS v18 RockNextGen design tokens.

## Overview

Rock Foundations is a purpose-built design system for Rock RMS-powered church websites and internal tools. Every component is crafted to feel warm, trustworthy, and human — the qualities that matter most to faith-based communities.

The library ships as a single HTML file with no build tooling. Drop it into a browser and explore all 26 components instantly. Less source files are compiled in the browser via less.js, making the token system fully visible and hackable without a Node environment.

All design tokens use Rock RMS v18 RockNextGen exact variable names (`@color-primary`, `@color-interface-strong`, `@spacing-medium`, etc.), so migrating styles directly into a Rock RMS theme requires zero renaming.

## Live Demo

[View Live Demo](https://YOUR_USERNAME.github.io/rock-foundations)

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/rock-foundations.git
cd rock-foundations
```

Then open `index.html` in your browser. For the best experience (and to allow Less `@import` resolution), serve via a local web server:

```bash
# VS Code: Install "Live Server" extension, right-click index.html → Open with Live Server
# Python 3
python -m http.server 8080
# Node
npx serve .
```

No build step required. No npm. No webpack.

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| Less (CSS preprocessor) | Design tokens + component styles | 4.2.0 via CDN |
| less.js | In-browser Less compilation | 4.2.0 |
| Vue.js | Interactive components (Modal, Toast, Dropdown, Tabs) | 3.x via CDN |
| Bootstrap | Grid system + CSS reset foundation | 3.4.1 via CDN |
| Font Awesome | All icons (consistent fa-solid weight) | 6.5.1 via CDN |
| Inter (Google Fonts) | Primary UI typeface | Variable |
| Merriweather (Google Fonts) | Display headings and giving widget | Variable |
| Vanilla JS | All non-Vue interactions | ES5 compatible |

## Component Library

### Foundations
- ✓ Color Palette — 20 Rock v18 design tokens with swatch grid
- ✓ Typography Scale — 8 sizes, 4 weights, Inter + Merriweather
- ✓ Spacing Scale — 7 tokens (4px → 64px)
- ✓ Shadow Scale — 5 elevation levels
- ✓ Border Radius — 6 tokens (3px → full pill)

### Core Components
- ✓ Buttons — 7 variants, 3 sizes, loading state, icon combos, groups
- ✓ Form Inputs — text, textarea, select, checkbox, radio, toggle, range
- ✓ Badges & Tags — filled, soft, outline, status, removable, counter
- ✓ Alerts — success, warning, danger, info, inline compact, dismissible
- ✓ Avatars — 6 sizes, CSS initials, status dots, group stacking
- ✓ Cards — basic, media, horizontal, stat, action, pricing
- ✓ Panels — collapsible with 5 color variants
- ✓ Tables — sortable, striped, hover, actions, checkboxes, pagination
- ✓ Navigation — breadcrumbs, tabs, pills

### Church Components
- ✓ Member Card — person profile with stats and action buttons
- ✓ Group Card — ministry group with capacity bar and join action
- ✓ Event Registration — full event block with countdown and CTA
- ✓ Giving Widget — preset amounts, fund selector, frequency tabs
- ✓ Prayer Request — expandable text, tags, Vue-powered pray counter
- ✓ Attendance Stats — KPI row with sparklines and trend indicators
- ✓ Check-In Badge — physical badge with security code and allergy alerts
- ✓ Volunteer Schedule — role/status table with confirm/decline actions

### Vue 3 Components
- ✓ Modal — 3 sizes, backdrop dismiss, Escape key, body scroll lock
- ✓ Toast Notifications — auto-dismiss, progress bar, stacked queue
- ✓ Dropdown Menu — icons, dividers, disabled + destructive items
- ✓ Tabs — hash-based routing, church-relevant content

## Design Tokens

All tokens use Rock RMS v18 exact naming conventions:

| Category | Example Variables |
|---|---|
| Primary Brand | `@color-primary`, `@color-primary-dark`, `@color-primary-soft` |
| Interface Scale | `@color-interface-strongest` → `@color-interface-softest` |
| Semantic | `@color-success-strong`, `@color-danger-soft`, `@color-info-soft` |
| Spacing | `@spacing-xsmall` (4px) → `@spacing-xxxlarge` (64px) |
| Border Radius | `@rounded-xsmall` (3px) → `@rounded-full` (9999px) |
| Shadows | `@shadow-xs` → `@shadow-xl` |
| Typography | `@font-size-xs` (11px) → `@font-size-3xl` (36px) |
| Transitions | `@transition-fast`, `@transition-base`, `@transition-slow` |
| Dark Mode | `@dark-bg`, `@dark-surface`, `@dark-surface-raised` |

## Rock RMS v18 Compatibility

Variable names are taken directly from the Rock RMS v18 RockNextGen CSS variable migration guide. When building or customizing a Rock RMS theme:

1. Copy `less/variables.less` into your Rock theme's Less entry point
2. The token names match Rock's `--color-primary`, `--color-interface-strong`, etc. exactly (with `@` prefix for Less vs `--` for CSS custom properties)
3. Dark mode overrides follow Rock v19's corrected interface scale direction

## Accessibility

Rock Foundations targets **WCAG AA compliance** for all components:

- All text color combinations meet 4.5:1 contrast ratio for normal text and 3:1 for large text
- Focus rings on every interactive element (custom `box-shadow` — outline is never removed)
- `aria-label` on all icon-only buttons
- `aria-expanded` on all toggle controls (panels, sidebar, hamburger)
- `aria-selected` on tab items
- `aria-live="polite"` on toast notification container
- `aria-modal="true"` on modal dialogs
- Error messages linked to inputs via `aria-describedby`
- Labels always associated with inputs via `for`/`id` pairs
- Minimum 44×44px touch targets on all interactive elements

## Dark Mode

Toggle dark mode via the sun/moon button in the topbar or sidebar. Preference persists to `localStorage` under the key `rf-dark-mode`.

All 26 components have intentional dark mode states — no white boxes on dark backgrounds, no invisible text.

## Browser Support

| Browser | Version |
|---|---|
| Chrome | Latest 2 |
| Firefox | Latest 2 |
| Safari | Latest 2 |
| Edge | Latest 2 |

> **Note:** less.js requires a local web server when loading `@import` files. Opening `index.html` via `file://` protocol may work in Firefox but will fail in Chrome without the `--allow-file-access-from-files` flag. Use VS Code Live Server or `python -m http.server` for zero-config local development.

## Repository Structure

```
rock-foundations/
├── index.html              # Main documentation page (all 26 components)
├── README.md
├── less/
│   ├── variables.less      # Rock RMS v18 design tokens
│   ├── mixins.less         # Reusable Less mixins
│   ├── reset.less          # CSS reset + base styles
│   ├── typography.less     # Type scale + display font
│   ├── utilities.less      # Helper classes
│   ├── main.less           # Entry point — imports everything
│   └── components/
│       ├── buttons.less
│       ├── forms.less
│       ├── cards.less
│       ├── badges.less
│       ├── avatars.less
│       ├── alerts.less
│       ├── modals.less
│       ├── navigation.less
│       ├── tables.less
│       ├── panels.less
│       └── church/
│           ├── member-card.less
│           ├── group-card.less
│           ├── event-block.less
│           ├── giving-widget.less
│           ├── prayer-card.less
│           ├── stat-card.less
│           ├── checkin-badge.less
│           └── volunteer-row.less
├── js/
│   ├── main.js             # Vanilla JS interactions
│   └── vue-components.js   # Vue 3 interactive components
└── assets/                 # (empty — all visuals are CSS-generated)
```

## License

MIT License — free to use, modify, and distribute.

## Acknowledgments

Built with deep respect for the [Rock RMS](https://www.rockrms.com/) design system and the incredible work of the Spark Development Network team. Special recognition to **Triumph Tech** — the highest-rated Rock RMS partner — whose standards of quality inspired every design decision in this library.

---

*Rock Foundations is an independent portfolio project and is not officially affiliated with Rock RMS or Triumph Tech.*
