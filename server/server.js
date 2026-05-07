import express from "express"
import dotenv from "dotenv"
import path from 'path';
import { fileURLToPath } from 'url';
import colors from "colors"
import cors from "cors"
import fs from 'fs';

// Local Imports
import connectDB from "./config/dbConfig.js"
import authRoutes from "./routes/authRoutes.js" 
import doctorRoutes from "./routes/doctorRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import slotRoutes from "./routes/slotRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import runSlotAutomation from "./cron/slotCron.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

// Global Error Catchers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err);
    process.exit(1);
});

// DB Connection
connectDB().then(() => {
    console.log("Database connected successfully".green);
    runSlotAutomation();
}).catch(err => {
    console.error("Database connection failed:".red, err.message);
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- STATIC FILE SERVING ---
// Robust path resolution for Render/Local
const rootDir = process.cwd();
const buildPath = path.join(rootDir, 'client', 'dist');

// Log path info for debugging
console.log(`[Server] Root Directory: ${rootDir}`);
console.log(`[Server] Build Path: ${buildPath}`);

// Serve static files from the React app
app.use(express.static(buildPath));

// Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", adminRoutes);
app.use("/api/reports", adminRoutes);

// SPA Routing: Handle any requests that don't match the ones above
app.get('/*', (req, res) => {
    // If it's an API request that wasn't caught, return 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API route not found" });
    }

    const indexPath = path.join(buildPath, 'index.html');
    
    // Check if the request is for an asset file that doesn't exist
    if (path.extname(req.path)) {
        console.log(`[Server] Asset 404: ${req.path}`);
        return res.status(404).send(`Asset not found: ${req.path}`);
    }

    // Otherwise, serve index.html for SPA routing
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.log(`[Server] index.html not found at ${indexPath}`);
        res.status(200).json({ 
            success: true, 
            message: "Clinic-Desk API is running. (Front-end build not found)" 
        });
    }
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue);
});