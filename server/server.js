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
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err);
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

// --- DIAGNOSTICS: FIND THE BUILD FOLDER ---
const rootDir = process.cwd();
console.log(`[Diagnostic] Current Working Directory: ${rootDir}`);

const findDist = (dir) => {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (file === 'dist') {
                    console.log(`[Diagnostic] Found a 'dist' folder at: ${fullPath}`.cyan);
                } else if (file !== 'node_modules' && file !== '.git') {
                    findDist(fullPath);
                }
            }
        }
    } catch (e) {}
};
findDist(rootDir);

// Resolve build path (Standard is client/dist)
const buildPath = path.resolve(rootDir, 'client', 'dist');
console.log(`[Server] Final Build Path set to: ${buildPath}`);

// --- STATIC FILE SERVING ---
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

// SPA Routing
app.get(/.*/, (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API route not found" });
    }

    const indexPath = path.join(buildPath, 'index.html');
    
    // IF THE REQUEST HAS AN EXTENSION AND IT'S NOT FOUND BY express.static
    if (path.extname(req.path)) {
        console.log(`[Server] Asset NOT FOUND: ${req.path}`.red);
        // DO NOT SEND HTML/JSON FOR ASSETS
        return res.status(404).type('text/plain').send(`Asset not found: ${req.path}`);
    }

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.log(`[Server] CRITICAL: index.html not found at ${indexPath}`.bgRed);
        res.status(200).send(`
            <h1>Clinic-Desk API is running</h1>
            <p>Frontend build not found at: <code>${buildPath}</code></p>
            <p>Please ensure 'npm run build' was successful.</p>
        `);
    }
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue);
});