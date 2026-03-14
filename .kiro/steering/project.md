---
inclusion: always
---

# Life Dashboard — Project Steering

## Project Overview
A To-Do List Life Dashboard built as a standalone web app. No frameworks, no backend, no build tools.

## Tech Stack
- HTML / CSS / Vanilla JavaScript only
- Browser LocalStorage for all persistence

## Folder Rules
- Only 1 CSS file: `css/style.css`
- Only 1 JS file: `js/app.js`
- Entry point: `index.html`

## Features Implemented
- Live clock, date, and time-of-day greeting
- Custom user name (stored in localStorage)
- Light / Dark mode toggle (stored in localStorage)
- Focus timer with configurable duration (default 25 min), start/stop/reset
- To-do list: add, inline edit, complete, delete — with duplicate prevention and sort options
- Quick links: add/delete URL bookmarks stored in localStorage

## Optional Challenges Chosen
1. Light / Dark mode
2. Custom name in greeting
3. Prevent duplicate tasks

## Code Style
- Keep code clean and readable
- No external libraries or CDN imports
- All state lives in localStorage under these keys:
  - `theme` — "light" | "dark"
  - `userName` — string
  - `timerDuration` — number (minutes)
  - `todos` — array of `{ id, text, done }`
  - `links` — array of `{ id, name, url }`
