# Tickit App

A full-stack note-taking application with a separated architecture.

| Branch | Project | Stack |
|---|---|---|
| [`backend`](https://github.com/Akila-G05/Tickit-App/tree/backend) | `TickitServer` — REST API | Java 17, embedded Tomcat, Hibernate 6, MySQL |
| [`frontend`](https://github.com/Akila-G05/Tickit-App/tree/frontend) | `TickitClient` — SPA client | React 19, Vite |
| `main` (this branch) | Documentation | Full project report (`REPORT.md`) |

## Quick start

```bash
# 1. Backend  (branch: backend) — needs local MySQL database "tickit2"
git checkout backend && cd TickitServer && mvn clean package exec:java

# 2. Frontend (branch: frontend)
git checkout frontend && cd TickitClient && npm install && npm run dev
```

API base: `http://localhost:8080/tasks` · UI: `http://localhost:5173`

See [REPORT.md](REPORT.md) for the complete report: technologies, structure, design, and recommendations.
