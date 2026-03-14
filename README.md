# Life Dashboard

A simple, clean personal dashboard to help organize your day. Built with plain HTML, CSS, and Vanilla JavaScript — no frameworks, no build tools, no setup required.

## Features

**Greeting**
- Live clock with seconds
- Current date display
- Time-of-day greeting (morning / afternoon / evening)
- Custom name support

**Focus Timer**
- Configurable duration (default 25 minutes)
- Start, stop, and reset controls
- Audio beep when timer finishes
- Duration saved across sessions

**To-Do List**
- Add, inline-edit, complete, and delete tasks
- Duplicate task prevention
- Sort by default, A→Z, Z→A, or done-last
- All tasks saved to localStorage

**Quick Links**
- Add and remove favorite website shortcuts
- Opens links in a new tab
- Links saved to localStorage

**Light / Dark Mode**
- Toggle between themes
- Preference saved across sessions

## Optional Challenges Implemented

1. Light / Dark mode
2. Custom name in greeting
3. Prevent duplicate tasks

## Project Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
    └── steering/
        └── project.md
```

## How to Use

Just open `index.html` in any modern browser. No installation or server needed.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Browser LocalStorage API

## Browser Support

Works in all modern browsers — Chrome, Firefox, Edge, and Safari.

## Deployment

This site can be published directly via GitHub Pages since it's a static web app with no build step required.
