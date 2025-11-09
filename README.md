# Clutch Chat Application

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-000?style=for-the-badge&logo=vercel&logoColor=white)](https://clutch-zjjr8.sevalla.app/)

A real-time chat application built with a modern tech stack, featuring a React frontend and a Node.js/Express backend with Socket.IO for real-time communication.

🔗 **Live Demo:** [https://clutch-zjjr8.sevalla.app/](https://clutch-zjjr8.sevalla.app/)

## 🚀 Features

- Real-time messaging with Socket.IO
- User authentication (JWT)
- Responsive UI built with React and TailwindCSS
- Modern UI components with DaisyUI
- State management with Zustand
- Image uploads with Cloudinary
- Form validation with express-validator
- Hot reloading for development

## 🛠 Tech Stack

### Frontend
- React 19
- Vite (Build tool)
- TailwindCSS with DaisyUI
- Zustand (State management)
- React Router (Routing)
- Socket.IO Client
- Axios (HTTP client)
- Lucide Icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- BcryptJS (Password hashing)
- Socket.IO (Real-time communication)
- Cloudinary (Image storage)
- Express Validator
- CORS enabled

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗 Project Structure

```
Clutch/
├── Backend/             # Backend server
│   ├── src/            # Source files
│   ├── .env            # Environment variables
│   └── package.json    # Backend dependencies
└── Frontend/           # Frontend React app
    ├── src/            # Source files
    ├── public/         # Static files
    └── package.json    # Frontend dependencies
```

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Vite](https://vitejs.dev/)
