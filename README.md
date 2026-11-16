# TrekToShikhar

Full stack project setup with **React (Vite)** frontend, **Tailwind CSS v4**, **Node.js + Express** backend, and **Supabase** database/auth.

---

## 📁 Project Structure

```
trektoshikhar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js     # Supabase backend client configuration
│   │   ├── routes/
│   │   │   └── api.js          # Express route definitions (sample health check)
│   │   └── server.js           # Express app setup & server entry point
│   ├── .env.example            # Backend environment variables template
│   ├── .gitignore
│   └── package.json            # express, cors, dotenv, @supabase/supabase-js, nodemon
│
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── utils.js        # cn() helper for conditional classes (clsx + tailwind-merge)
│   │   ├── supabaseClient.js   # Supabase frontend client
│   │   ├── App.jsx             # Modern dashboard with live backend test
│   │   ├── index.css           # Tailwind CSS v4 import & base styling
│   │   └── main.jsx
│   ├── .env.example            # Frontend environment variables template
│   ├── .gitignore
│   ├── package.json            # React 19, Tailwind v4, Lucide-react, React Router, Axios
│   └── vite.config.js          # Vite configuration with @tailwindcss/vite
│
└── README.md
```

---

## 🧰 Modern Libraries Installed

- **Tailwind CSS v4** (`@tailwindcss/vite`): Next-gen lightning-fast CSS styling
- **Lucide React** (`lucide-react`): Modern, clean UI icon set
- **clsx + tailwind-merge** (`cn()` utility in `src/lib/utils.js`): Dynamic Tailwind class merging
- **React Router DOM** (`react-router-dom`): Multi-page client-side routing
- **Axios** (`axios`): HTTP client for easy backend communication
- **Supabase JS** (`@supabase/supabase-js`): Client SDK for database and authentication

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
# Create your .env file
copy .env.example .env

# Run development server
npm run dev
```
Backend will run at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

---

### 2. Frontend Setup

```bash
cd frontend
# Create your .env file
copy .env.example .env

# Run development server
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## ⚡ Supabase Setup
1. Create a project on [Supabase](https://supabase.com/).
2. Grab your **Project URL**, **Anon Key**, and **Service Role Key** from Settings > API.
3. Put them into:
   - `backend/.env`
   - `frontend/.env`
