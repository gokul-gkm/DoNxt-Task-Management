# DoNxt - Task Management System

DoNxt is a modern, full-stack task management application designed with a premium user experience and real-time collaboration at its core. Built with a robust technical stack, it features seamless project organization, interactive dashboards, and instantaneous updates across all connected clients.

## 🚀 Key Features

- **Real-time Synchronization**: Powered by Socket.io, every task creation, edit, or status change is instantly reflected for all users.
- **Premium UI/UX**: A highly responsive and animated interface built using **React 19**, **Tailwind CSS v4**, and **GSAP** for professional-grade transitions.
- **Project Organization**: Categorize tasks into projects with custom color-coding and progress tracking.
- **Interactive Dashboard**: Get a birds-eye view of your productivity with precise time-remaining counters, status breakdowns, and "Next Due" highlights.
- **Custom Form Controls**: Includes a bespoke, premium Date-Time Picker with per-minute granularity and GSAP-animated input fields.
- **Secure Authentication**: Robust sign-in/sign-up flow with JWT-based sessions, Zod validation, and email verification.

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, Lucide Icons, Vanilla CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form, Zod
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express 5 (Alpha)
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io 4
- **Dependency Injection**: TypeDI
- **Logging**: Pino / Pino-http

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gokul-gkm/DoNxt-Task-Management.git
   cd DoNxt
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend/` directory:
     ```env
     PORT=8008
     MONGODB_URI=mongodb://localhost:27017/donxt
     CLIENT_URL=http://localhost:3003
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     NODE_ENV=development
     LOG_LEVEL=debug
     ACCESS_TOKEN_SECRET="your-access-token-secret"
     REFRESH_TOKEN_SECRET="your-refresh-token-secret"
     VERIFY_EMAIL_SECRET="your-verify-email-secret"
     ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend/` directory:
     ```env
     VITE_API_BASE_URL=http://localhost:8008/api
     VITE_SOCKET_URL=http://localhost:8008
     ```

---

## 🏃 Running the Application

### Development Mode

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3003`.

---

## 📁 Project Structure

```text
DoNxt/
├── frontend/           # React + Vite Application
│   ├── src/
│   │   ├── components/ # Modular & Reusable UI Components
│   │   ├── pages/      # View Components (Dashboard, Projects, etc.)
│   │   ├── store/      # Zustand State Stores
│   │   └── services/   # API & Socket.io integration
├── backend/            # Express + TypeScript Server
│   ├── src/
│   │   ├── controllers/# Route Logic
│   │   ├── models/     # Mongoose Schemas
│   │   ├── services/   # Business Logic (TypeDI)
│   │   └── routers/    # API Route Definitions
```

## 📄 License
This project is licensed under the ISC License.
