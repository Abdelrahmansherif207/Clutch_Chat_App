import express from 'express';
import dotenv from 'dotenv';
import Path from 'path';
// import routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
// packages
import path from 'path';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from 'cors'
import { app, server } from './lib/socket.js'


// app Initialization
dotenv.config();
const PORT = process.env.PORT || 9090;
const __dirname = Path.resolve();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// use routes
app.use("/api/auth", authRoutes);
app.use('/api/messages', messageRoutes);


// configuration for deployment
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))
    app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html")))
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDB()
}); 