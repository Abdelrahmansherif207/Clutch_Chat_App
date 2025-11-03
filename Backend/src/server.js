import express from 'express';
import dotenv from 'dotenv';

// import routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';


// app Initialization
dotenv.config();
const app = express();
const PORT = process.env.PORT || 9090;

// use routes
app.use("api/auth", authRoutes);
app.use('api/messages', messageRoutes);

// middlewares





app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); 