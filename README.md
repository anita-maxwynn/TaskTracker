# 🚀 TaskTracker: Web-Based Project/Task Management System

TaskTracker is a web-based system designed for efficient **project and task management**. It offers features like scheduling, user roles, and status dashboards to enhance team collaboration and productivity.

---

## ✨ Core Features

- **Project & Task Management**: Create, update, and track projects and their associated tasks.
- **Scheduling and Status Dashboards**: Assign deadlines and statuses to tasks with a real-time dashboard to visualize progress.
- **User Roles and Authentication**: Secure access and granular control through user roles and authentication.
- **RESTful API**: Clean separation between frontend and backend using a RESTful API.

---

## 🛠️ Tools and Technologies

TaskTracker uses a modern three-tier architecture for scalability and maintainability.

| Component           | Technology         | Description                                            |
|---------------------|-------------------|--------------------------------------------------------|
| Backend Framework   | Django (Python)   | Handles application logic, models, and API endpoints   |
| Frontend Framework  | React + TypeScript| Manages the user interface and state                   |
| Database            | SQLite            | Relational database for development                    |
| API Communication   | Axios             | HTTP client for frontend-backend communication         |
| Data Layer          | Django ORM        | Defines models for Users, Projects, Tasks, and Roles   |

---

## 📊 Language Composition

This repository is primarily written in:

- **TypeScript:** 39.7%
- **Python:** 33.1%
- **CSS:** 26.1%
- **Other:** 1.1%

---

## 📐 System Architecture

The application follows a three-tier structure:

1. **Presentational Layer**: React handles the UI and state management.
2. **Application Layer**: Django REST API for business logic and data transmission.
3. **Data Layer**: SQLite for relational data managed by Django ORM.

#### Key Files/Modules

| File/Module         | Role                                                  |
|---------------------|-------------------------------------------------------|
| `models.py`         | Defines database ORM models (Projects, Tasks, Users)  |
| `views.py`          | Backend logic for handling HTTP requests and APIs     |
| `serializers.py`    | Handles serialization of models for JSON APIs         |
| `urls.py`           | Centralized URL dispatcher for REST endpoints         |
| `auth.ts`           | Frontend authentication logic and state management    |
| `projects.ts`, `tasks.ts` | Frontend modules for UI and API interaction    |

---

## 🏃 Getting Started

### Prerequisites

- Python (with Django)
- Node.js and npm/yarn (for React)

### Installation

*Instructions for setting up the backend (Django) and frontend (React) should be added here.*

---

## 📚 Learning Outcomes

Key software engineering practices emphasized in this project:

- **Full-Stack Development**: Practical experience with Django and React.
- **Architecture**: ORM modeling, RESTful API design, and frontend state management.
- **CASE Tools**: Django Admin for backend, React Developer Tools for frontend.
- **Code Quality**: Modular coding, configuration management, and basic testing.

---

## 🔗 Repository

The full codebase for this project is available on GitHub:  
**[https://github.com/anita-maxwynn/TaskTracker.git](https://github.com/anita-maxwynn/TaskTracker.git)**
