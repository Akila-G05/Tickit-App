# Tickit Server

REST API backend for the **Tickit** notes app. Serves a JSON API for managing tasks/notes, backed by MySQL through Hibernate.

> Frontend lives in the [`frontend`](https://github.com/Akila-G05/Tickit-App/tree/frontend) branch (`TickitClient`, React + Vite).

## Tech stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language runtime |
| Apache Tomcat (embedded) | 10.1.7 | Servlet container, booted from `Main` on port **8080** |
| Hibernate ORM | 6.1.7.Final | Persistence / object-relational mapping |
| MySQL Connector/J | 9.0.0 | JDBC driver |
| org.json | 20230227 | JSON parsing & building |
| Maven | — | Build tool |

## Project structure

```
TickitServer/
├── pom.xml                                  Maven build (JAR packaging)
└── src/main/
    ├── java/com/tickit/
    │   ├── Main.java                        Embedded Tomcat bootstrap (port 8080)
    │   ├── model/
    │   │   └── TaskServlet.java             /tasks endpoint (CRUD + search) + CORS
    │   └── entity/
    │       └── Task.java                    JPA entity → "tasks" table
    └── resources/
        └── hibernate.cfg.xml                DB connection & Hibernate config
```

## REST API

Base URL: `http://localhost:8080/tasks`

| Method | Params | Body | Action |
|---|---|---|---|
| `GET` | — | — | List all tasks |
| `GET` | `?search=keyword` | — | Case-insensitive search on title/description |
| `GET` | `?id=n` | — | Fetch a single task |
| `POST` | — | `{title, description, created_date}` | Create a task |
| `PUT` | — | `{id, title, description}` | Update a task |
| `DELETE` | `?id=n` | — | Delete a task |

- Reads return a JSON array: `[{"id": 1, "title": "...", "description": "...", "created_date": "..."}]`
- Mutations return `{"message": "<status text>"}` with HTTP 200, or 404/400 on failure.
- CORS is open (`Access-Control-Allow-Origin: *`) with preflight `OPTIONS` handling so the separately hosted frontend can call the API directly.

## Data model

Table `tasks` (auto-created/updated by `hibernate.hbm2ddl.auto = update`):

| Column | Type | Notes |
|---|---|---|
| id | int, PK | auto-increment |
| title | varchar | required |
| description | TEXT | note body |
| created_date | varchar | display string supplied by the client |

## Configuration

Database settings live in `src/main/resources/hibernate.cfg.xml`:

```xml
<property name="hibernate.connection.url">
  jdbc:mysql://localhost:3306/tickit2?useSSL=false&amp;allowPublicKeyRetrieval=true
</property>
<property name="hibernate.connection.username">root</property>
<property name="hibernate.connection.password">******</property>
```

Prerequisite: a running local MySQL instance with the database `tickit2` created:

```sql
CREATE DATABASE IF NOT EXISTS tickit2;
```

## Running

```bash
cd TickitServer
mvn clean package exec:java
# Tickit Server Started on Port 8080...
```

Quick smoke test:

```bash
curl http://localhost:8080/tasks
curl -X POST http://localhost:8080/tasks -H "Content-Type: application/json" -d "{\"title\":\"First note\",\"description\":\"Hello Tickit\",\"created_date\":\"2026-01-01\"}"
```

## Known limitations

- DB credentials are hard-coded in `hibernate.cfg.xml` — move to environment variables before deploying.
- The servlet mixes HTTP/business/persistence layers — extract a service/DAO layer as the app grows.
- No authentication or rate limiting.
