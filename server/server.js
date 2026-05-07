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
import runSlotAutomation from "./cron/slotCron.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

// --- 1. GLOBAL ERROR HANDLERS ---
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥', err);
});
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥', err);
});

// --- 2. STATIC FILE SERVING (Move to Top) ---
const rootDir = process.cwd();
const buildPath = path.resolve(rootDir, 'client', 'dist');

// Log what we found
console.log(`[Server] Root Dir: ${rootDir}`);
console.log(`[Server] Looking for build at: ${buildPath}`);
if (fs.existsSync(buildPath)) {
    console.log(`[Server] ✅ Build folder exists!`.green);
} else {
    console.log(`[Server] ❌ Build folder NOT found at ${buildPath}`.red);
}

// Serve assets with absolute priority and correct MIME types
app.use('/assets', express.static(path.join(buildPath, 'assets'), {
    immutable: true,
    maxAge: '1y',
    fallthrough: false, // Don't let asset 404s hit the SPA catch-all
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.use(express.static(buildPath));

// --- 3. STANDARD MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 4. DB CONNECTION ---
connectDB().then(() => {
    console.log("Database connected successfully".green);
    runSlotAutomation();
}).catch(err => {
    console.error("Database connection failed:".red, err.message);
});

// --- 5. API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", adminRoutes);
app.use("/api/reports", adminRoutes);

// --- 6. SPA CATCH-ALL ---
app.get(/.*/, (req, res) => {
    // If it's an API route that wasn't caught, it's a 404
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API endpoint not found" });
    }

    // If it's a file request (has extension) but reach here, it's missing
    if (path.extname(req.path)) {
        console.log(`[Server] 404 Asset: ${req.path}`.yellow);
        return res.status(404).type('text/plain').send(`Asset not found: ${req.path}`);
    }

    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <div style="font-family:sans-serif;text-align:center;padding:50px;">
                <h1 style="color:#2563eb;">Clinic-Desk API is Online</h1>
                <p>Frontend build (index.html) is missing at: <code>${buildPath}</code></p>
                <p>Please check your Render build logs for errors during 'npm run build'.</p>
            </div>
        `);
    }
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue);
});