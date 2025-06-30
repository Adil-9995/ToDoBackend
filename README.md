# 🛠️ ToDo App – Backend (MERN Stack)

This is the **backend** of the ToDo App built using the **MERN stack** during the DevTown 5-Day Bootcamp. It handles all core functionalities such as **user authentication, task CRUD operations**, and secure API routes using **JWT**.

🚀 **Frontend (Live App)**:  
🔗 [https://trial-nxqs.onrender.com/](https://trial-nxqs.onrender.com/)

🖥️ **Frontend Code Repo**:  
📂 [ToDoFrontend](https://github.com/Adil-9995/ToDoFrontend)

---

## 🌐 Hosted With

- **Backend API Hosting**: [Render](https://render.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Environment Management**: `.env` file for MongoDB URI and JWT Secret

---

## 🔒 Authentication

- **Signup/Login** routes using JWT
- Passwords hashed using **bcryptjs**
- Protected routes using token-based authentication via middleware

---

## 📁 API Endpoints

| Method | Endpoint            | Description                  | 
|--------|---------------------|------------------------------|
| POST   | `/signup`           | Register a new user          | 
| POST   | `/login`            | Login user and return token  | 
| GET    | `/tasks`            | Get all tasks for user       | 
| POST   | `/tasks`            | Add new task                 |
| PUT    | `/tasks/:id`        | Update task by ID            | 
| DELETE | `/tasks/:id`        | Delete task by ID            | 

---

## 🔧 Technologies Used

- **Node.js** – Runtime environment
- **Express.js** – Server framework
- **MongoDB Atlas** – Cloud-based NoSQL database
- **Mongoose** – MongoDB object modeling
- **JWT (jsonwebtoken)** – Authentication
- **bcryptjs** – Password hashing
- **CORS** – Cross-origin resource sharing

---

## ⚙️ Project Setup

1. Clone this repo:
   ```bash
   git clone https://github.com/Adil-9995/ToDoBackend.git
