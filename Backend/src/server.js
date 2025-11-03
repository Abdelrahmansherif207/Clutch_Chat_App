import express from 'express';
import dotenv from 'dotenv';
import Path from 'path';
// import routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';


// app Initialization
dotenv.config();
const app = express();
const PORT = process.env.PORT || 9090;

const __dirname = Path.resolve();

// use routes
app.use("/api/auth", authRoutes);
app.use('/api/messages', messageRoutes);

// middlewares



// configuration for deployment
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))
    app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html")))
}

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); 