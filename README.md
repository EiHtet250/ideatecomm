# MINT Adventure Guide

A responsive web guide for visitors to the MINT Museum of Toys, built with **React**, **Vite** and **TypeScript**.

> **Status:** project backbone only. Every page is a placeholder; features (maps, directions, QR scanning, login, Discovery Trail game, chatbot, APIs, floor-light integration) have not been built yet.

## Getting started

Requirements: [Node.js](https://nodejs.org/) 20.19+ (or 22.12+) and npm.

```bash
git clone https://github.com/EiHtet250/ideatecomm.git
cd ideatecomm
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Type-check and build for production (`dist/`) |
| `npm run preview` | Serve the production build locally            |

## Routes

| Path               | Page            |
| ------------------ | --------------- |
| `/`                | Welcome         |
| `/home`            | Home            |
| `/directions`      | Directions      |
| `/exhibits`        | Exhibits        |
| `/discovery-trail` | Discovery Trail |
| `/profile`         | Profile         |
| `/settings`        | Settings        |
| `/help`            | Help            |

Any other path shows a "Page not found" placeholder.

## Folder structure

```
├── index.html              # HTML entry point
├── public/                 # Static files served as-is (favicon, images)
├── src/
│   ├── main.tsx            # App bootstrap (React root + router)
│   ├── App.tsx             # Route definitions
│   ├── routes/paths.ts     # Central list of URL paths and nav links
│   ├── layout/             # Shared page shell (header, nav, footer)
│   ├── pages/              # One component per page/screen
│   ├── components/         # Shared, reusable UI components
│   │   └── common/         # Generic building blocks (e.g. PagePlaceholder)
│   ├── data/               # Static museum data (floors, locations, exhibits, stamps)
│   ├── types/              # Shared TypeScript types (Floor, Location, Exhibit, Stamp)
│   └── styles/global.css   # Global styles and design tokens (CSS variables)
├── vite.config.ts
└── tsconfig.json
```

## Working on this project

- **Adding a page:** create it in `src/pages/`, add its path to `src/routes/paths.ts`, and register it in `src/App.tsx`.
- **Shared components:** put reusable components in `src/components/` and re-export them from `src/components/index.ts`.
- **Museum data:** fill in the arrays in `src/data/` using the types from `src/types/museum.ts`. Extend the types as features need more fields.
- **Styling:** change colours and spacing through the CSS variables at the top of `src/styles/global.css`.
- Work on a feature branch and open a pull request into `main`; run `npm run build` before pushing.
