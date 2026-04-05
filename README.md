# 🚀 Campus Freelance

A **full-stack ready backend system** for a campus-based freelancing platform where students can post tasks, apply for work, and collaborate securely.

---

## 📌 Overview

This project is a **FastAPI-based backend** designed to enable a peer-to-peer freelancing ecosystem within a college campus.

Users can:

* Post tasks (assignments, projects, etc.)
* Apply for tasks
* Assign freelancers
* Communicate via chat
* Complete tasks

---

## 🧠 Features

### 🔐 Authentication

* User Registration
* Login with JWT Token
* Secure password hashing (bcrypt)

### 👤 User System

* Get current logged-in user
* Role-based access using tokens

### 🧱 Task Management

* Create tasks
* View all tasks
* Assign freelancer
* Mark task as completed

### 🙋 Application System

* Apply to tasks
* View applicants for a task
* Prevent duplicate applications

### 💬 Chat System

* Task-based messaging
* Only task owner and assigned freelancer can chat

### 💰 Payment (Manual)

* Payments handled manually via admin (for MVP stage)
* Prevents off-platform transactions and fraud

---

## 🏗️ Tech Stack

* **Backend Framework:** FastAPI
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Authentication:** JWT (python-jose)
* **Password Hashing:** Passlib (bcrypt)

---

## 📂 Project Structure

```
app/
├── db/
│   ├── base.py
│   ├── base_models.py
│   └── session.py
│
├── models/
│   ├── user.py
│   ├── task.py
│   ├── application.py
│   └── message.py
│
├── schemas/
│   ├── user.py
│   ├── task.py
│   └── application.py
│
├── routes/
│   ├── auth.py
│   ├── user.py
│   ├── task.py
│   ├── application.py
│   └── chat.py
│
├── services/
│   ├── auth_service.py
│   ├── task_service.py
│   └── application_service.py
│
├── utils/
│   ├── security.py
│   └── dependencies.py
│
├── config.py
└── main.py
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/campus-freelance-backend.git
cd campus-freelance-backend
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Setup Environment Variables

Create `.env` file:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/campus_freelance
SECRET_KEY=yoursecretkey
```

---

## ▶️ Run Server

```bash
uvicorn app.main:app --reload
```

Open:
👉 http://127.0.0.1:8000/docs

---

## 🔁 API Flow

### 👤 User

1. Register → `/auth/register`
2. Login → `/auth/login`

### 🧱 Tasks

* Create → `/tasks/`
* View → `/tasks/`

### 🙋 Applications

* Apply → `/applications/`
* View applicants → `/applications/task/{task_id}`

### 🤝 Workflow

1. Owner assigns freelancer
2. Chat between users
3. Task marked as completed

---

## 🔐 Authentication Usage

Use JWT token in requests:

```
Authorization: Bearer <your_token>
```

---

## 🎯 Future Improvements

* Online Payment Integration (Razorpay/Stripe)
* Ratings & Reviews System
* Notifications
* Real-time Chat (WebSockets)
* File Upload System

---

## 👨‍💻 Author

**Biprajit & Team**
Campus Freelance Platform 🚀

---

## 📢 Note

This is an MVP (Minimum Viable Product) built for academic and prototype purposes.
Payment and moderation are handled manually in this stage.

---
