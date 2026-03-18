# Library Management System

A personal full-stack Library Management System built with a modern React frontend and a blazing-fast Python FastAPI backend.

## 🚀 Features

### **Backend (FastAPI)**
- **Role-Based Access Control (RBAC):** Distinct roles for `admin`, `librarian`, and `user`.
- **JWT Authentication:** Secure token-based login system.
- **Book Management:** Librarians and Admins can add, update, and manage the book catalog.
- **Loan Tracking:** Users can uniquely check out available books. The system enforces availability and automatically attaches the current user to the loan via JWTs.
- **My Loans Dashboard:** Users can view their personal checkout history.
- **SQLite Database:** Fast, local development database managed by SQLAlchemy models and Pydantic schemas.

### **Frontend (React + Vite)**
- **Modern Architecture:** Built with Vite for instant server start.
- **Premium Aesthetics:** Styled entirely with highly-optimized Vanilla CSS focusing on dynamic glassmorphism and modern user layouts.
- **Client-Side Routing:** Dynamic dashboard navigation with `react-router-dom`.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Axios, Lucide React, Vanilla CSS.
- **Backend:** Python 3, FastAPI, SQLAlchemy, Passlib (Bcrypt), Python-Jose (JWTs).

---

## 💻 How to Run Locally

### 1. Start the Backend (API Server)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py
```
*The API will be available at `http://localhost:8000`.*
*You can view the interactive Swagger API Documentation at `http://localhost:8000/docs`.*

### 2. Start the Frontend (UI Server)

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The web app will be available at `http://localhost:5173`.*
