# Service Scheduler

A modern web application for managing medical service appointments and user requests. This project provides a platform where admins can accept new users and manage service requests from doctors.

## Features

- **Modern UI/UX**: Clean, responsive design with beautiful gradients and animations
- **Responsive Navigation**: Mobile-friendly navbar with hamburger menu
- **Login System**: Professional login form with validation (frontend only for now)
- **React-based**: Built with React 18 and modern JavaScript features

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── Navbar.css         # Navigation styles
│   ├── LoginPage.js       # Login form component
│   └── LoginPage.css      # Login page styles
├── App.js                 # Main application component
├── App.css                # Global application styles
├── index.js               # Application entry point
└── index.css              # Global styles and resets
```

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 12 or higher) — for the backend database

### Step 1: Install Node dependencies

From the project root:

```bash
npm install
```

### Step 2: Install and set up PostgreSQL

1. Install PostgreSQL if you don’t have it:
   - Windows: [PostgreSQL installer](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: use your package manager (e.g. `sudo apt install postgresql`)

2. Start the PostgreSQL service (if it isn’t running).

3. Create the database and user (in `psql` or pgAdmin):
   ```sql
   CREATE DATABASE service_scheduler;
   ```
   If your PostgreSQL user has a different name or password, note them for the next step.

### Step 3: Configure environment variables

In the project root, create a `.env` file (it’s gitignored) with your database settings:

```env
# Optional — defaults are shown
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=service_scheduler

# Optional — backend port (default 4000)
PORT=4000
```

Adjust `PGUSER` and `PGPASSWORD` to match your PostgreSQL setup.

### Step 4: Initialize the database

Run the schema and seed data script against your database:

```bash
psql -U postgres -d service_scheduler -f db/init.sql
```

(Change `-U postgres` if you use a different user.)

This creates all tables and inserts sample data, including an admin user:
- **Email:** `admin@example.com`
- **Password:** `admin123`

### Step 5: Run the app

**Option A — Frontend and backend together (recommended):**

```bash
npm run dev
```

This starts:
- Backend API at **http://localhost:4000**
- React app at **http://localhost:3000** (proxied to the API)

**Option B — Run them separately:**

- Terminal 1 (backend):
  ```bash
  npm run server
  ```
- Terminal 2 (frontend):
  ```bash
  npm start
  ```

### Step 6: Open the app

In your browser go to **[http://localhost:3000](http://localhost:3000)**.

Log in with `admin@example.com` / `admin123` to use the dashboard.

### Quick reference — available scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start backend + frontend (recommended) |
| `npm start` | Start React app only (port 3000) |
| `npm run server` | Start Express API only (port 4000) |
| `npm run server:dev` | Start API with auto-reload (nodemon) |
| `npm run build` | Production build of the React app |
| `npm test` | Run tests |

## Current Status

This is a **frontend-only** implementation. The following features are planned for future development:

- **Backend Integration**: User authentication and database
- **Admin Dashboard**: User management and request approval system
- **Doctor Interface**: Service selection and request submission
- **User Management**: Registration, approval workflow, and role-based access

## Design Features

- **Gradient Backgrounds**: Modern purple-blue gradients
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Responsive Design**: Mobile-first approach with breakpoints
- **Smooth Animations**: Hover effects and transitions
- **Icon Integration**: Font Awesome icons for better UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project is currently in development. Future contributions will be welcome once the basic structure is complete.

## License

This project is proprietary and confidential. 