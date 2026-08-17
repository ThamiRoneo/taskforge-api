# TaskForge API

Backend REST API for a task management application, built with Node.js and Express.

## Tech Stack

- Node.js
- Express
- nanoid (task ID generation)
- fs/promises (file-based persistence)

## Project Structure

taskforge-api/
├── server.js
├── routes/
│ └── tasks.js
├── middleware/
│ ├── logger.js
│ └── errorHandler.js
├── data/
│ ├── taskStore.js
│ └── tasks.json
├── public/
│ └── index.html
├── package.json
└── README.md


## Installation

1. Clone the repository:
```bash
   git clone <your-repo-url>
   cd taskforge-api
```

2. Install dependencies:
```bash
   npm install
```

## Running the Project

Start the server:

```bash
npm start
```

Or with auto-restart on file changes during development:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default. Once running, visit `http://localhost:3000` in a browser to view the static task list, which fetches live data from the API.

## API Routes

| Method | Route | Description | Success | Failure |
|---|---|---|---|---|
| GET | `/tasks` | Return all tasks | 200 | — |
| GET | `/tasks/:id` | Return a single task by ID | 200 | 404 if not found |
| GET | `/tasks/:id/verify` | Simulate an async external check on a task (1–2s delay) | 200 | 404 if not found, 422 if task fails verification |
| POST | `/tasks` | Create a new task (requires `title` in body) | 201 | 400 if title missing |
| PUT | `/tasks/:id` | Update an existing task by ID | 200 | 404 if not found |
| DELETE | `/tasks/:id` | Remove a task by ID | 204 | 404 if not found |

### Task Object Shape

```json
{
  "id": "string (generated)",
  "title": "string (required)",
  "completed": "boolean (defaults to false)",
  "createdAt": "string, ISO date (set automatically)"
}
```

### Example Requests

**Create a task**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write documentation"}'
```

**Update a task**
```bash
curl -X PUT http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a task**
```bash
curl -X DELETE http://localhost:3000/tasks/<id>
```

## Error Handling

All errors are routed through a single centralized error-handling middleware (`middleware/errorHandler.js`). No route builds its own error response — every failure (missing fields, not-found resources, malformed JSON, failed verification) is thrown with a `.status` and caught centrally, so the client always receives a consistent `{ "error": "message" }` shape and never a raw stack trace.

## Data Persistence

Tasks are stored in `data/tasks.json` and read/written via `fs.promises` (see `data/taskStore.js`). Data persists across server restarts. The seed file includes one deliberately malformed task (missing `title`) used to test the `/verify` endpoint's error path.

## Notes

- Task IDs are generated with `nanoid`.
- The logging middleware (`middleware/logger.js`) logs every incoming request's method, path, and timestamp to the console.