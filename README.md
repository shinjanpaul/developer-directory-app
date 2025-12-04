# 👨‍💻 Developer Directory App

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)
![React](https://img.shields.io/badge/React-v18-61DAFB)
![Node](https://img.shields.io/badge/Node-v20-339933)
![Status](https://img.shields.io/badge/Status-Completed-success)

> A full-stack MERN application developed for the **Talrn Internship Round-2**. Authenticated users can create, manage, and explore developer profiles with advanced filtering and search capabilities.

---

## 🚀 Live Demo

**Frontend:** (https://developer-directory-app-mbxb.vercel.app/)  
**Backend:** (https://developer-directory-app-5srl.onrender.com)

---

## ✨ Features

### 🔐 Authentication & Security
* **User Signup & Login:** Secure registration system.
* **JWT Authentication:** JSON Web Tokens used for secure session management.
* **Password Hashing:** Passwords encrypted using `bcrypt`.
* **Protected Routes:** Only logged-in users can perform CRUD operations.

### 👤 Developer Profile Management
* **Create Profile:** Add name, role, tech stack, experience, description, and photo.
* **Tech Stack Tags:** Visual representation of skills.
* **Full CRUD:** Edit and delete profiles seamlessly.

### 📚 Directory & Discovery
* **Smart Search:** Find developers by Name or Tech Stack.
* **Filters:** Filter profiles by Role (Frontend / Backend / Full-Stack).
* **Sorting:** Sort by Experience (High → Low / Low → High).
* **Pagination:** Efficient data loading for large datasets.
* **Responsive Design:** Optimized for Mobile and Desktop using Tailwind CSS.

---

## 🧰 Tech Stack

### Frontend
* ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React (Vite)**
* ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS**
* ![React Router](https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white) **React Router v6**
* **Context API** (State Management)
* **React Toastify** (Notifications)

### Backend
* ![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) **Node.js**
* ![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) **Express.js**
* ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB + Mongoose**
* **JWT & Bcrypt** (Auth)

---
## 🏗️ Architecture Overview

This application follows a **Client-Server** architecture using the **MERN Stack**.

### 1. **Frontend (Client-Side)**
* Built with **React (Vite)** for a fast, single-page application experience.
* Uses **Context API** to manage global Authentication state (User sessions).
* Communicates with the backend via **RESTful API calls** using `fetch` or `axios`.
* Deployed on **Vercel** for high-performance edge delivery.

### 2. **Backend (Server-Side)**
* Built with **Node.js** and **Express.js**.
* Exposes secure API endpoints (e.g., `/api/developers`, `/api/auth`).
* Implements **JWT (JSON Web Tokens)** to protect private routes; the server verifies the token before allowing CRUD operations.
* Deployed on **Render** as a web service.

### 3. **Database**
* **MongoDB Atlas** (Cloud) stores all user and developer data.
* **Mongoose** is used as an ODM (Object Data Modeling) tool to enforce strict schemas for Developer profiles.

### 🔄 Data Flow
1.  User logs in → Server verifies credentials → Returns **JWT**.
2.  Frontend stores JWT in memory/local storage.
3.  User requests "Developer List" → Frontend sends GET request with JWT.
4.  Server verifies JWT → Fetches data from MongoDB → Returns JSON response.
5.  Frontend renders the data using Tailwind CSS components.
## 🛠️ Installation & Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

### 1. Clone the Repository
```bash
git clone [https://github.com/shinjanpaul/developer-directory-app.git](https://github.com/shinjanpaul/developer-directory-app.git)
cd developer-directory-app
