# TaskFlow — Smart Task Manager

A full-stack Kanban-style task management application. Register an account, create tasks, and track your progress across **Todo**, **In Progress**, and **Done** stages.

> **Live Demo**: [Website](https://indpro-rosy.vercel.app)
---

## Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Frontend   | React 18, Vite, React Router v6, Axios   |
| Backend    | Node.js, Express, Mongoose               |
| Database   | MongoDB                                  |
| Auth       | JWT (jsonwebtoken), bcryptjs              |
| Styling    | Plain CSS (custom, no UI framework)       |

---

## Project Structure

```
task-manager/
├── client/         # React + Vite frontend
│   ├── src/
│   │   ├── api/          # Axios instance
│   │   ├── components/   # TaskCard, TaskColumn, TaskModal
│   │   ├── context/      # AuthContext (JWT + user state)
│   │   ├── pages/        # AuthPage, Dashboard
│   │   ├── App.jsx       # Router setup
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # All styles
│   ├── index.html
│   └── package.json
├── server/         # Node.js + Express backend
│   ├── models/           # User, Task (Mongoose)
│   ├── routes/           # auth, tasks
│   ├── middleware/        # JWT auth middleware
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

---

## Local Setup

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** — a running instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in:

| Variable     | Description                                        |
|--------------|----------------------------------------------------|
| `MONGO_URI`  | Your MongoDB connection string                     |
| `JWT_SECRET` | A strong random secret for signing JWTs            |
| `PORT`       | Server port (default: `5000`)                      |
| `CLIENT_URL` | Frontend origin for CORS (default: `http://localhost:5173`) |

Then install and run:

```bash
npm install
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

| Variable       | Description                                  |
|----------------|----------------------------------------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000`) |

Then install and run:

```bash
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint    | Body                      | Description           |
|--------|-------------|---------------------------|-----------------------|
| POST   | `/register` | `{ email, password }`     | Create a new account  |
| POST   | `/login`    | `{ email, password }`     | Login, returns JWT    |

### Tasks (`/api/tasks`) — requires `Authorization: Bearer <token>`

| Method | Endpoint | Body                              | Description            |
|--------|----------|------------------------------------|------------------------|
| GET    | `/`      | —                                  | List user's tasks      |
| POST   | `/`      | `{ title, description?, stage? }` | Create a task          |
| PUT    | `/:id`   | `{ title?, description?, stage? }`| Update a task          |
| DELETE | `/:id`   | —                                  | Delete a task          |

---

## Assumptions & Decisions

- **JWT stored in `localStorage`** — This is the simplest approach for a SPA. The tradeoff is that `localStorage` is accessible to JavaScript and vulnerable to XSS (unlike `httpOnly` cookies). For a production app handling sensitive data, consider using `httpOnly` cookies with CSRF protection instead.

- **Stage change from card dropdown** — Users can change a task's stage directly from the card without opening the edit modal. This provides a much faster UX for the most common action (moving tasks between columns).

- **Monorepo structure** — Both `client/` and `server/` live in a single repository for simplicity. In a larger project, you might use separate repos or a tool like Turborepo/Nx.

- **No drag and drop** — Drag-and-drop between columns is a natural next step but was kept out of scope to keep the implementation focused and dependency-light.

- **Token expiry: 7 days** — JWTs expire after 7 days. There is no refresh token mechanism; users simply log in again after expiry.

---

## Known Limitations

1. **No refresh tokens** — When the JWT expires, the user is logged out and must sign in again. A refresh token flow would improve UX.
2. **No drag-and-drop** — Tasks can only be moved between stages via the dropdown selector, not by dragging.
3. **No task ordering** — Tasks within a column are sorted by creation date (newest first). Custom ordering/priority is not supported.
4. **No password reset** — There is no "forgot password" flow.
5. **No real-time updates** — If the same user has the app open in two tabs, changes in one tab won't appear in the other without a manual refresh.
6. **No input sanitization on server** — While Mongoose provides basic validation, there is no dedicated sanitization library (e.g., `express-validator` or `sanitize-html`).

---

## License

MIT
