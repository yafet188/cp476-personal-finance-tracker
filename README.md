# Personal Finance Tracker

## Project Overview
A web-based personal finance tracker that allows users to manage and track their income and expenses over time.

---

## Milestone 02 Summary
During Milestone 02, our team transitioned from planning to implementation. We completed the following:

### Frontend (HTML, CSS, JavaScript)
- Built multiple working pages: Dashboard, Expenses, Budgets, Categories, Reports, Login, and Settings.
- Implemented client-side form validation.
- Used DOM manipulation and event handling to dynamically render data.
- Integrated localStorage/sessionStorage for temporary frontend data persistence.
- Connected pages through consistent navigation and user session handling.

### Backend (Node.js)
- Implemented server structure and routing.
- Created API endpoints for handling core data (expenses, budgets, etc.).
- Structured project for scalable server-side logic.

### Database (MySQL)
- Designed relational schema for users, expenses, categories, and budgets.
- Defined core entities and relationships.
- Prepared database structure to integrate with backend APIs.

---

## Team Roles (Milestone 02)
- **Jose – Database Lead**
  - Designed MySQL schema
  - Defined tables and relationships
  - Structured data architecture

- **Ben – Backend Lead**
  - Built Node.js server
  - Implemented API routes
  - Connected backend logic to database

- **Yafet – Frontend & Project Management Lead**
  - Built frontend pages and UI components
  - Implemented JavaScript logic and storage handling
  - Managed repository, Kanban board, and documentation

---

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js
- Database: MySQL

---

## How to Run the Project Locally

### 1️⃣ Run the Frontend

If using Live Server (recommended for development):

```bash
cd frontend
```

Open `dashboard.html` or `login.html` using VSCode Live Server.

OR open directly in browser:

```bash
open dashboard.html
```

Frontend typically runs on:
```
http://127.0.0.1:5500/
```

---

### 2️⃣ Run the Backend

Navigate to the backend folder:

```bash
cd backend
npm install
npm start
```

Backend runs on:
```
http://localhost:5000/
```

Make sure MySQL is running before starting the backend.

---

## Current Project Status
Milestone 02 – Functional frontend interface + backend server structure + database schema design completed.

Next steps will include full integration between frontend, backend, and database.