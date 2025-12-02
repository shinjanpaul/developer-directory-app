# Developer Directory App (Talrn Internship Task)

A full-stack developer directory application built as part of the Talrn.com Full Stack Internship task.

This project allows you to add developer details, view them in a list, and filter/search developers by role or tech stack.  
Frontend is built using **React (Vite)** + **Tailwind CSS** and backend uses **Node.js + Express + MongoDB**.

---

## 🚀 Features

### ✅ Frontend (React + Vite + Tailwind)
- Add developer with:
  - Name
  - Role (Frontend / Backend / Full-Stack)
  - Tech Stack (comma-separated)
  - Experience (years)
- Display developer list
- Search by tech stack (case-insensitive)
- Filter by role
- Toast notifications (success/error)
- Responsive UI
- Clean, modern Tailwind styling

### ✅ Backend (Node.js + Express)
- `POST /developers` → Add developer  
- `GET /developers` → Get all developers  
- MongoDB database (Mongoose)  
- CORS enabled  

---

## 📁 Project Structure

project-root/
│
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── Developer.js
│   ├── routes/
│   │   └── developers.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── DeveloperForm.jsx
    │   │   ├── DeveloperList.jsx
    │   │   └── Toast.jsx
    │   └── assets/ (optional)
    ├── package.json
    ├── .env
    └── README.md
