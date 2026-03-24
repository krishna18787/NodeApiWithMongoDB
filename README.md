# Simple Node API

This project contains a minimal Express server with two endpoints:

- `GET /` — serves a browser UI for task CRUD.
- `GET /api-docs` — Swagger UI documentation.
- `GET /api-docs.json` — raw OpenAPI JSON.
- `GET /api/hello` — returns a greeting message.
- `POST /api/echo` — echoes JSON request body.
- `GET /api/health` — basic health check.
- `POST /api/auth/register` — create a user and return a JWT.
- `POST /api/auth/login` — login and return a JWT.
- `GET /api/auth/me` — return the logged-in user from a bearer token.
- `GET /api/profile` — fetch the latest uploaded profile image metadata.
- `POST /api/profile` — upload a profile image with `multipart/form-data`.
- `POST /api/tasks` — create a task.
- `GET /api/tasks` — list all tasks.
- `GET /api/tasks/:id` — get one task.
- `PUT /api/tasks/:id` — update one task.
- `DELETE /api/tasks/:id` — delete one task.

Setup

```bash
npm install
cp .env.example .env
npm run dev    # start with nodemon
npm start      # start normally
```

Node.js requirement: `20.19.0` or newer.

MongoDB setup

1. Install MongoDB locally or create a free cluster in MongoDB Atlas.
2. Open `.env` and set `MONGODB_URI` and `JWT_SECRET`.
3. Start the API. The server will connect to MongoDB before listening on the port.

Example local connection:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/npm-server
```

Example MongoDB Atlas connection:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/npm-server?retryWrites=true&w=majority
```

Test examples

```bash
open http://localhost:3000
open http://localhost:3000/api-docs

curl http://localhost:3000/api/hello

curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/echo \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}'

curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Krishna","email":"krishna@example.com","password":"secret123"}'

curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"krishna@example.com","password":"secret123"}'

curl http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer <token>"

curl -X POST http://localhost:3000/api/profile \\
  -F "name=Krishna" \\
  -F "image=@/path/to/profile.png"

curl -X POST http://localhost:3000/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"First task","description":"Learn MongoDB CRUD"}'
```
