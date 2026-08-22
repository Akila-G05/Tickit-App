# Tickit Client

React single-page client for the Tickit notes app. Consumes the REST API served by `TickitServer` (see the [`backend`](https://github.com/Akila-G05/Tickit-App/tree/backend) branch).

## Stack

- React 19 (hooks, function components)
- Vite 8
- Plain CSS (dark theme via custom properties)

## Features

- Create, edit, and delete notes
- Live search with 300 ms debounce (`GET /tasks?search=`)
- Loading / error states when the backend is unreachable

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

The API base URL is defined in `src/api.js` and defaults to `http://localhost:8080/tasks` — start the backend first.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |

## Structure

```
src/
├── main.jsx              React root
├── App.jsx               State + data flow
├── api.js                REST calls for /tasks
├── index.css             Theme
└── components/
    ├── TaskForm.jsx      create/edit form
    ├── SearchBar.jsx     debounced search
    ├── TaskList.jsx      list container
    └── TaskCard.jsx      note card
```
