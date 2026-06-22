# OLX Clone Marketplace

A full-stack OLX marketplace clone featuring user authentication, product management, and a dedicated shopping cart system. Built using the MERN stack and optimized for responsive styling across mobile and desktop devices.

---

## 📁 Project Structure

This project is organized as a monorepo containing distinct applications for the client and server sides:

 ```text
olx/
├── backend/          # Node.js + Express API server
├── frontend/         # React + Redux Toolkit SPA client
└── README.md         # Documentation
```
🛠️ Tech Stack
Frontend
Framework: React (TypeScript)

State Management: Redux Toolkit (RTK)

Form Handling: React Hook Form

Routing: React Router DOM

Styling: Custom Vanilla CSS / Dynamic inline objects

Backend
Runtime Environment: Node.js

Framework: Express.js

Database: MongoDB

Authentication: JSON Web Tokens (JWT) & bcrypt encryption

🚀 Getting Started
Follow these steps to set up and run the application locally on your machine.

Prerequisites
Make sure you have Node.js installed. You will also need either a local MongoDB setup or a MongoDB Atlas connection string.

1. Clone the Repository
Bash
git clone [https://github.com/Dawn7077/OLX_CLONE.git](https://github.com/Dawn7077/OLX_CLONE.git)
cd OLX_CLONE
2. Backend Configuration
Navigate to the backend directory:

Bash
   cd backend
Install dependencies:

Bash
   npm install
Create a .env file in the backend/ directory and configure your environment variables:

Code snippet
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
Start the backend server:

Bash
   npm run dev
3. Frontend Configuration
Open a new terminal window and navigate to the frontend directory:

Bash
   cd frontend
Install dependencies:

Bash
```bash
   npm install
```
Start the Vite/React development server:

Bash
```bash
   npm run dev
```

🔒 Environment & Security Note
[!IMPORTANT]
Local development files such as .env, node_modules/, and internal database storage layers (mongodOlx/) are ignored by Git tracking via isolated .gitignore files to safeguard secrets and optimize storage layouts.


 

### How to push this to GitHub:
Once you save the file, update your GitHub repository by running these commands from your root terminal:

 
git add README.md
git commit -m "docs: add comprehensive project readme"
git push
