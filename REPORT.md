# Tickit — Full-Stack Project Report

## 1. Overview

**Tickit** is a note/task-taking application built with a **separated full-stack architecture**: an independent Java REST backend and an independent React single-page client, communicating over HTTP + JSON.

The repository is organised by branches — each branch contains exactly one deployable unit:

| Branch | Contains | Role |
|---|---|---|
| `main` | This report + README | Documentation |
| `backend` | `TickitServer/` (Java REST API) | REST API server on port 8080 |
| `frontend` | `TickitClient/` (React SPA) | Browser client consuming the API |

> A legacy combined Java/WAR project (`Tickit/`) predates the split and is **not** part of the repository.

---

## 2. Technologies

### Backend — branch `backend` (`TickitServer`)

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language runtime |
| Apache Tomcat (embedded) | 10.1.7 | Servlet container (`tomcat-embed-core`, `tomcat-embed-jasper`) |
| Hibernate ORM | 6.1.7.Final | Object-relational mapping / persistence |
| MySQL Connector/J | 9.0.0 | JDBC driver for MySQL |
| org.json | 20230227 | JSON serialization/deserialization |
| Maven | — | Build & dependency management |
| Jakarta Servlet API | 6.0 (via Tomcat 10) | HTTP request handling |

### Frontend — branch `frontend` (`TickitClient`)

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library (function components + hooks) |
| Vite | 8.x | Dev server & production bundler |
| JavaScript (ES modules) | ES2022+ | Language |
| oxlint | — | Linting |

No UI framework or state-management library is used by design — the app stays lightweight with plain CSS and React's built-in hooks (`useState`, `useEffect`, `useCallback`).

### Database

| Technology | Details |
|---|---|
| MySQL | `jdbc:mysql://localhost:3306/tickit2` |
| DDL strategy | `hibernate.hbm2ddl.auto = update` (auto schema sync in development) |

---

## 3. Project Structure

```
GitHub repo: akilagimhana2005-cmyk/Tickit-App   (private)
│
├── main      → REPORT.md, README.md
├── backend   → TickitServer/   (Java 17 · embedded Tomcat · Hibernate)
└── frontend  → TickitClient/   (React 19 · Vite)
```

### Backend — `TickitServer`

```
TickitServer/
├── pom.xml                                  Maven build (JAR packaging)
└── src/main/
    ├── java/com/tickit/
    │   ├── Main.java                        Embedded Tomcat bootstrap (port 8080)
    │   ├── model/
    │   │   └── TaskServlet.java             REST endpoint (/tasks) + CORS
    │   └── entity/
    │       └── Task.java                    JPA entity → "tasks" table
    └── resources/
        └── hibernate.cfg.xml                Hibernate + DB configuration
```

### Frontend — `TickitClient`

```
TickitClient/
├── index.html                               SPA entry page
├── package.json                             Scripts: dev / build / preview / lint
├── vite.config.js                           Vite configuration (@vitejs/plugin-react)
└── src/
    ├── main.jsx                             React root (StrictMode)
    ├── App.jsx                              App shell: state, data flow, layout
    ├── api.js                               REST client (fetch wrapper for /tasks)
    ├── index.css                            Global theme (dark, custom properties)
    └── components/
        ├── TaskForm.jsx                     Create / edit form (controlled inputs)
        ├── SearchBar.jsx                    Debounced search input
        ├── TaskList.jsx                     List container
        └── TaskCard.jsx                     Single note card (edit/delete actions)
```

### Data model — `Task` (table `tasks`)

| Field | Column | Type | Notes |
|---|---|---|---|
| id | id (PK) | int, auto-increment | `GenerationType.IDENTITY` |
| title | title | varchar | required, max 50 chars enforced in the UI |
| description | description | TEXT | free-form note body |
| createdDate | created_date | varchar | display string generated client-side |

---

## 4. Design

### System architecture

```
┌─────────────────────┐   HTTP/JSON (REST)   ┌──────────────────────┐        ┌─────────┐
│  TickitClient       │ ◄──────────────────► │  TickitServer        │ ◄────► │  MySQL  │
│  React 19 + Vite    │   GET/POST/PUT/DEL   │  Embedded Tomcat     │  ORM   │ tickit2 │
│  localhost:5173     │   /tasks             │  :8080               │        └─────────┘
└─────────────────────┘                      │  Servlet + Hibernate │        └─────────┘
                                             └──────────────────────┘
```

### Backend design

- **Embedded Tomcat** — no external app server; `Main.main()` boots Tomcat on port **8080** and registers the servlet programmatically.
- **Stateless REST API** — all state lives in MySQL; each request opens a fresh Hibernate session (try-with-resources).
- **CORS enabled globally** — `Access-Control-Allow-Origin: *` plus preflight `OPTIONS` handling so the separately hosted React dev server can call the API.

#### REST API contract

Base URL: `http://localhost:8080/tasks`

| Method | Params | Body | Action |
|---|---|---|---|
| `GET` | — | — | List all tasks |
| `GET` | `?search=keyword` | — | Case-insensitive LIKE search on title/description |
| `GET` | `?id=n` | — | Fetch single task |
| `POST` | — | `{title, description, created_date}` | Create task |
| `PUT` | — | `{id, title, description}` | Update task |
| `DELETE` | `?id=n` | — | Delete task |

Reads return a JSON array; mutations return `{"message": "..."}`. Errors use HTTP 404 / 400.

### Frontend design

- **Component hierarchy**: `App` → `TaskForm`, `SearchBar`, `TaskList` → `TaskCard`.
- **Single source of truth**: tasks live in `App` state; children are presentational and receive callbacks (`onSave`, `onEdit`, `onDelete`).
- **Debounced live search** — typing in `SearchBar` triggers an API call 300 ms after the last keystroke.
- **Edit-in-place UX** — clicking *Edit* loads the note into the top form (form switches to edit mode, card is highlighted); *Cancel* returns to create mode.
- **Centralised API layer** (`api.js`) — all fetch calls in one module, mapping 1:1 to backend endpoints.
- **Theming via CSS custom properties** — dark theme defined once in `:root`; easy to re-skin or add a light theme later.
- **Resilience** — loading indicator and error banner when the backend is unreachable.

### Request flow (search example)

```
User types "note" in SearchBar (debounce 300 ms)
  → App.loadTasks("note") → GET http://localhost:8080/tasks?search=note
      → TaskServlet.doGet() → HQL like-query → JSONArray
  ← [{id, title, description, created_date}, …]
  → setTasks(data) → TaskList re-renders cards
```

---

## 5. Other Important Things

### Strengths

- True separation of concerns: either side can be redeployed/replaced independently.
- Simple deployment: backend is a single JAR with embedded Tomcat; frontend builds to static files.
- Consistent JSON contract keeps integration trivial; schema evolves automatically during development.

### Issues & recommendations

1. **Hard-coded DB credentials** — username/password sit in `hibernate.cfg.xml`. Move to environment variables or an untracked properties file.
2. **No backend layering** — the servlet mixes HTTP handling, business logic, and persistence. Extract a `TaskService`/DAO layer.
3. **`created_date` stored as String** — prevents SQL-level date sorting/filtering. Prefer `LocalDateTime` mapped to a datetime column (the legacy project already did this).
4. **Wildcard CORS (`*`)** — fine for development; restrict to the deployed frontend origin in production.
5. **Manual JSON building** — consider Jackson and DTOs to cut boilerplate.
6. **API base URL hard-coded in `api.js`** — move it to a Vite env variable (`VITE_API_URL`) per environment.
7. **No tests** — add backend unit/integration tests and frontend component tests.
8. **No authentication** — anyone who can reach port 8080 can modify data; add auth before any real deployment.

### Running locally

**Backend** (requires local MySQL with database `tickit2`):

```bash
git clone https://github.com/akilagimhana2005-cmyk/Tickit-App.git
git checkout backend
cd TickitServer
mvn clean package exec:java        # starts on http://localhost:8080
```

**Frontend**:

```bash
git checkout frontend
cd TickitClient
npm install
npm run dev                        # opens on http://localhost:5173
```
