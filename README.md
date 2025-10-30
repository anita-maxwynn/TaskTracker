# 🚀 TaskTracker: Web-Based Project/Task Management System

[cite_start]TaskTracker is a web-based system designed for efficient **project and task management**, offering core features like scheduling, user roles, and status dashboards to enhance team collaboration and productivity[cite: 2, 3].

## ✨ Core Features

* [cite_start]**Project & Task Management**: Easily **create, update, and track** projects and their associated tasks[cite: 18].
* [cite_start]**Scheduling and Status Dashboards**: Assign **deadlines and statuses** to tasks for a clear visual representation of progress via real-time dashboards[cite: 21, 22].
* [cite_start]**User Roles and Authentication**: Secure resource access and granular control through managed **user roles** and robust authentication/authorization mechanisms[cite: 15, 16].
* [cite_start]**RESTful API**: Clean separation between the frontend and backend using a **RESTful API** for all data communication[cite: 10, 26].

---

## 🛠️ Tools and Technologies

[cite_start]This system is built using a modern **three-tier architecture** [cite: 26][cite_start], ensuring a clean separation of concerns and maintainability[cite: 27].

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | **Django** (Python) | [cite_start]Handles application logic, models, and API endpoints[cite: 4, 6, 26]. |
| **Frontend Framework** | **React with TypeScript** | [cite_start]Manages the user interface, state, and client-side logic[cite: 4, 7, 28]. |
| **Database** | **SQLite** | [cite_start]Simple and easy-to-set-up relational database for development[cite: 4, 8, 32]. |
| **API Communication** | **Axios** | [cite_start]HTTP client for reliable frontend-backend communication[cite: 9, 28]. |
| **Data Layer** | **Django ORM** | [cite_start]Defines relational models for Users, Projects, Tasks, and Roles[cite: 10, 31]. |

---

## 📐 System Architecture

[cite_start]The application follows a three-tier structure[cite: 26]:

1.  [cite_start]**Presentational Layer**: Handled by **React** for the User Interface and state management[cite: 26, 28].
2.  [cite_start]**Application Layer**: Managed by the **Django REST API** for business logic and data transmission[cite: 26, 27].
3.  [cite_start]**Data Layer**: Utilizes **SQLite** to store relational data defined by Django's ORM[cite: 26, 31].

### Key Files/Modules

| File/Module | Role |
| :--- | :--- |
| `models.py` | [cite_start]Defines **database ORM models** (Projects, Tasks, Users, Roles)[cite: 31, 45]. |
| `views.py` | [cite_start]**Backend logic** for handling HTTP requests and API endpoints[cite: 45]. |
| `serializers.py` | [cite_start]Handles the **serialization** of models for JSON API communication[cite: 45]. |
| `urls.py` | [cite_start]Centralized **URL dispatcher** for routing REST endpoints[cite: 36, 45]. |
| `auth.ts` | [cite_start]**Frontend authentication** logic and state management[cite: 16, 45]. |
| `projects.ts` & `tasks.ts` | [cite_start]Frontend modules managing project/task-related **UI and API interaction**[cite: 19, 45]. |

---

## 🏃 Getting Started

### Prerequisites

* Python (with Django)
* Node.js and npm/yarn (for React)

### Installation

*Instructions would typically go here for setting up the backend (Django) and frontend (React).*

---

## 📚 Learning Outcomes

The development of this project emphasized several key software engineering practices:

* [cite_start]**Full-Stack Development**: Practical experience with the full lifecycle using **Django and React**[cite: 47].
* [cite_start]**Architectural Practices**: Application of **ORM modeling, RESTful API design**, and frontend state management[cite: 48].
* [cite_start]**CASE Tools**: Exposure to tools like **Django Admin** for model management [cite: 39, 40] [cite_start]and React Developer Tools for debugging[cite: 41].
* [cite_start]**Code Quality**: Implementation of modular coding, configuration management with separate environment settings, and basic testing practices[cite: 50, 51].

---

## 🔗 Repository

The full codebase for this project can be found on GitHub:
[cite_start]**[https://github.com/anita-maxwynn/TaskTracker.git](https://github.com/anita-maxwynn/TaskTracker.git)** [cite: 53]
