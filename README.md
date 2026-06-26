# InsightAI

An AI-powered data analyst web app. Upload a CSV or Excel file, ask questions in plain English, and get instant SQL-backed charts, tables, and AI-generated insights — no SQL knowledge required.

## Features

- **Natural language queries** — ask questions like "What are the top 10 products by revenue?" and get answers instantly
- **Auto-generated visualizations** — AI picks the right chart type (bar, line, or table) based on your data
- **AI insights** — a plain-English summary is generated alongside every query result
- **Dataset management** — upload CSV / XLSX files up to 50MB, view schema and column stats
- **Query history** — all past queries are saved and can be re-run in one click
- **JWT authentication** — secure user accounts with token-based auth

## Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS
- Recharts (charts)
- TanStack Query (data fetching)
- Zustand (auth state)
- React Router v7

**Backend**
- Django 4.2, Django REST Framework
- PostgreSQL + SQLAlchemy (query execution)
- OpenAI API (SQL generation + insight generation)
- PyJWT (authentication)
- Pandas + openpyxl / xlrd (file parsing)
- Gunicorn + Whitenoise (production serving)

## Project Structure

```
InsightAI/
├── insightai_backend/       # Django REST API
│   ├── users/               # Auth (register, login, JWT)
│   ├── datasets/            # File upload, schema extraction
│   ├── queries/             # NL → SQL → results pipeline
│   │   └── services/        # LLM, SQL extraction, validation, execution
│   ├── utils/               # JWT auth, response helpers, DB connection
│   └── insightai/           # Django settings and URLs
│
└── insightai_frontend/      # React + Vite SPA
    └── src/
        ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage, DatasetDetailPage
        ├── components/      # Auth, Dataset, Query, Common components
        ├── hooks/           # useAuth, useDatasets, useQueryHistory
        └── services/        # Axios API client
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/InsightAI.git
cd InsightAI
```

### 2. Set up the database

```sql
psql -U postgres
CREATE USER insightai_user WITH PASSWORD 'password';
CREATE DATABASE insightai_dev OWNER insightai_user;
\q
```

### 3. Set up the backend

```bash
cd insightai_backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your values (see Environment Variables below)

# Run migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

### 4. Set up the frontend

```bash
cd insightai_frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local   # or create .env.local manually
# Add: VITE_API_BASE_URL=http://localhost:8000/api

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend — `insightai_backend/.env`

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Django secret key | `django-secret-...` |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/insightai_dev` |
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-...` |
| `OPENAI_MODEL` | Model to use for SQL generation | `gpt-3.5-turbo` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-jwt-secret` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins (production) | `https://your-app.com` |

### Frontend — `insightai_frontend/.env.local`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

## How It Works

1. **Upload** a CSV or Excel file — the backend parses it, stores it in PostgreSQL, and extracts the schema and column statistics.
2. **Ask a question** in plain English — the question and schema are sent to the OpenAI API, which returns a PostgreSQL SELECT query.
3. **Validation** — the generated SQL is checked for safety (no DDL/DML, no unauthorized tables or columns) before execution.
4. **Execution** — the validated SQL runs against your uploaded data in PostgreSQL.
5. **Results** — the app detects the best chart type, renders a visualization, and generates a plain-English AI insight about the result.

## Building for Production

### Backend

```bash
cd insightai_backend
python manage.py collectstatic --no-input
gunicorn insightai.wsgi:application --bind 0.0.0.0:8000
```

### Frontend

```bash
cd insightai_frontend
npm run build
# Output is in dist/ — deploy to any static host (Vercel, Netlify, etc.)
```

## License

MIT
