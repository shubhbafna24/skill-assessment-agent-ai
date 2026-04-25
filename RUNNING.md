# How to Run — AI Skill Assessment Agent

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Local development |
| npm | 9+ | Package management |
| Docker Desktop | Latest | Container-based run |
| PostgreSQL | 15+ | Database (local dev only) |

---

## Option 1: Docker Compose (Recommended)

The easiest way to run the full stack (app + database + migrations) with a single command.

### 1. Copy and configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set at least one AI provider key:

```env
# Choose one: openrouter | groq | openai | gemini
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
```

The `DATABASE_URL` in `.env.example` is for local dev only. Docker Compose sets its own `DATABASE_URL` internally, so you do not need to change it for Docker usage.

### 2. Start everything

```bash
docker compose up --build
```

This runs three services in order:
1. **db** — PostgreSQL 15 (waits until healthy)
2. **migrate** — runs `prisma migrate deploy` to create all tables
3. **web** — starts the Next.js app on port 3000

> First build takes 3–5 minutes because it downloads the base image and installs all dependencies.

### 3. Open the app

```
http://localhost:3000
```

### Useful Docker commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f web

# Stop everything
docker compose down

# Stop and delete the database volume (full reset)
docker compose down -v
```

---

## Option 2: Local Development (Without Docker)

Use this for faster iteration — no container rebuild needed on every change.

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Local PostgreSQL connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/skill_agent"

# AI provider (pick one)
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Start a local PostgreSQL database

If you have Docker available, this is the quickest way:

```bash
docker run -d \
  --name skill-agent-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=skill_agent \
  -p 5432:5432 \
  postgres:15-alpine
```

Alternatively, use any local PostgreSQL installation and create a database named `skill_agent`.

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

For the first run during development you can also use:

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The app is available at `http://localhost:3000` with hot-reload enabled.

---

## AI Provider Setup

The app supports four providers. Set `AI_PROVIDER` and the corresponding key in your `.env`.

### OpenRouter (Recommended — has free models)

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
```

Sign up at [openrouter.ai](https://openrouter.ai) → Keys → Create Key.

### Groq (Fast, generous free tier)

```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

Sign up at [console.groq.com](https://console.groq.com) → API Keys.

### Google Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza...
```

Get a key at [aistudio.google.com](https://aistudio.google.com) → Get API Key.

### OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Get a key at [platform.openai.com](https://platform.openai.com) → API Keys. Requires a funded account.

---

## Database Management

### View / edit data (Prisma Studio)

```bash
npx prisma studio
```

Opens a visual browser UI at `http://localhost:5555`.

### Apply schema changes during development

```bash
npx prisma db push
```

### Create a new migration after editing `prisma/schema.prisma`

```bash
npx prisma migrate dev --name describe-your-change
```

### Apply pending migrations in production / Docker

```bash
npx prisma migrate deploy
```

---

## How to Use the App

1. Open `http://localhost:3000`
2. Fill in **Candidate Name** and **Target Job Title**
3. Upload the candidate's **Resume** (PDF, DOCX, or TXT)
4. Upload the **Job Description** (PDF, DOCX, or TXT)
5. Click **Run AI Agent**

The agent runs three steps sequentially:

| Step | What happens |
|------|-------------|
| UPLOADING | Files are parsed and stored in PostgreSQL |
| ASSESSING | AI scores each required skill (0–10) with reasoning |
| PLANNING | AI generates a personalized learning roadmap for gaps |

Results are displayed immediately on the right panel.

---

## Production Build (Without Docker)

```bash
npm run build
npm start
```

Ensure all environment variables are set before running `npm start`.

---

## Troubleshooting

### `PrismaClientInitializationError: libssl.so.1.1 not found`

Prisma on Alpine Linux requires OpenSSL. The Dockerfile installs it automatically. For local dev on macOS/Linux this should not appear. If it does:

```bash
# macOS
brew install openssl

# Ubuntu/Debian
sudo apt-get install libssl-dev
```

### `Error: ECONNREFUSED` (database connection refused)

The app cannot reach PostgreSQL. Check:
- Docker: `docker compose ps` — confirm the `db` container is healthy
- Local: confirm PostgreSQL is running on port 5432
- `.env` `DATABASE_URL` matches your database credentials

### Port 3000 already in use

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

Or change the port in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"   # maps host port 3001 to container port 3000
```

### `migrate` service fails with "database does not exist"

The `db` healthcheck may need more time on a slow machine. Increase the retry count in `docker-compose.yml`:

```yaml
healthcheck:
  retries: 20
```

### File upload returns 500

- Confirm the AI provider key is valid and set in `.env`
- Check `docker compose logs web` for the full error message
- File size limit: Vercel Hobby has a 4.5 MB payload cap; Docker has no limit

### Reset everything and start fresh

```bash
docker compose down -v   # removes containers and the pgdata volume
docker compose up --build
```
