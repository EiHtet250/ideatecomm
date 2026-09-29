# MINT Adventure Guide

A mobile-friendly web guide for visitors to the MINT Museum of Toys, built with **React**, **Vite** and **TypeScript**.

> **Status: development backbone only.** Every page is a placeholder that shows the planned layout and a "Planned for this page" list. There is no login, no backend and no real features yet.

## Getting started

Requirements: [Node.js](https://nodejs.org/) 20.19+ (or 22.12+) and npm.

```bash
git clone https://github.com/EiHtet250/ideatecomm.git
cd ideatecomm
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). You land on the **development preview** page.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Type-check and build for production (`dist/`) |
| `npm run preview` | Serve the production build locally            |

## Temporary development preview (`/`)

The root page has two links: **Preview Visitor Side** and **Preview Staff Side**. It exists only so the team can work on both sides before authentication exists.

⚠️ **This is not security.** Anyone can open any URL, including `/staff`. A yellow "Development preview" banner is shown on every page as a reminder. When real login is built:

- visitor accounts should be sent to Visitor Home (`/visitor`)
- staff accounts should be sent to Staff Home (`/staff`)
- the `/staff` routes need a role guard (see the comment in `src/App.tsx`)
- the preview page and banner (`src/pages/dev/`, `DevPreviewBanner`) should be removed

## Routes

**Public / auth** (plain layout, no navigation)

| Path       | Page            |
| ---------- | --------------- |
| `/welcome` | Welcome         |
| `/login`   | Log in (layout) |
| `/signup`  | Sign up (layout) |

**Visitor side** (`VisitorLayout`)

| Path                | Page            | How to reach it                     |
| ------------------- | --------------- | ----------------------------------- |
| `/visitor`          | Visitor Home    | Nav: Home                           |
| `/visitor/map`      | Museum Map      | Card on Visitor Home                |
| `/visitor/trail`    | Discovery Trail | Nav + card on Visitor Home          |
| `/visitor/chatbot`  | Museum Chatbot  | Nav                                 |
| `/visitor/settings` | Settings        | Nav                                 |
| `/visitor/profile`  | Profile         | Circular profile avatar in header   |
| `/visitor/help`     | Help            | "? Help" in header                  |

Visitor navigation is **Home · Discovery Trail · Chatbot · Settings**, with a profile avatar and visitor name in the header. On phones the nav moves to a bottom tab bar.

**Staff side** (`StaffLayout`, side menu with space for future features)

| Path                   | Page          |
| ---------------------- | ------------- |
| `/staff`               | Staff Home    |
| `/staff/help-requests` | Help Requests |

Any other path shows "Page not found".

## What is still a placeholder

Nothing below is implemented yet; each has a dashed placeholder box on its page:

- **Login / sign-up:** fields only. No authentication, email OTP, role check or account storage. The submit buttons are disabled.
- **Museum Map:** floor selector, floor map, exhibit details and directions after a QR scan.
- **Discovery Trail:** game map, stops, challenges and digital stamps.
- **Chatbot:** no chatbot service connected.
- **Profile / Settings / Help:** the name and email shown are dummy text; the staff help-request form is not built.
- **Staff Help Requests:** no live requests, alerts, messaging or staff location. The status labels (New / In progress / Resolved) are for layout only.

Out of scope for this backbone: Google Maps or other map APIs, AI APIs, QR scanning, game logic, floor lights, and any backend.

## Folder structure

```
├── index.html                # HTML entry point
├── public/                   # Static files served as-is (favicon, images)
└── src/
    ├── main.tsx              # App bootstrap (React root + router + styles)
    ├── App.tsx               # All route definitions
    ├── routes/paths.ts       # URL paths and nav link lists
    ├── layouts/              # Page shells
    │   ├── PublicLayout.tsx  #   Welcome / Login / Sign up
    │   ├── VisitorLayout.tsx #   Visitor header, nav, bottom tab bar on phones
    │   └── StaffLayout.tsx   #   Staff header + side menu
    ├── pages/
    │   ├── dev/              # Temporary development preview page
    │   ├── auth/             # Welcome, Login, Sign up
    │   ├── visitor/          # Visitor Home, Museum Map, Discovery Trail, Chatbot, Profile, Settings, Help
    │   └── staff/            # Staff Home, Help Requests
    ├── components/           # Shared components for both sides
    │   ├── common/           #   PagePlaceholder, PlaceholderBox, ProfileBadge, DevPreviewBanner
    │   └── forms/            #   FormField
    ├── data/                 # Museum data shared by Museum Map and Discovery Trail
    │                         #   floors, locations, exhibits, stamps, trailStops (empty for now)
    ├── types/                # Shared TypeScript types
    │   ├── museum.ts         #   Floor, Location, Exhibit
    │   ├── trail.ts          #   Stamp, TrailStop
    │   └── user.ts           #   UserProfile, UserRole, HelpRequest
    └── styles/
        ├── global.css        # Design tokens (CSS variables) and shared component styles
        └── layouts.css       # Visitor / staff / public shells and phone breakpoints
```

## Working on this project

- **Adding a page:** create it in the right `src/pages/` sub-folder, add its path to `src/routes/paths.ts`, and register it in `src/App.tsx` under the matching layout.
- **Building a feature:** replace the page's `PlaceholderBox` areas with real components and remove items from its "Planned" list as they are done.
- **Shared components:** put them in `src/components/` and re-export them from `src/components/index.ts`.
- **Museum data:** fill in the arrays in `src/data/` using the types in `src/types/`. The Museum Map and Discovery Trail must both read from this same data.
- **Styling:** change colours and spacing through the CSS variables at the top of `src/styles/global.css`.
- Work on a feature branch and open a pull request into `main`. Run `npm run build` before pushing.
