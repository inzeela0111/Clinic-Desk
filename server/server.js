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

// --- STATIC FILE SERVING CONFIG ---
// Try multiple paths to find the dist folder on Render
const possiblePaths = [
    path.resolve(process.cwd(), 'client', 'dist'),
    path.resolve(__dirname, '..', 'client', 'dist'),
    path.resolve(process.cwd(), 'dist'),
];

let buildPath = possiblePaths[0];
for (const p of possiblePaths) {
    if (fs.existsSync(path.join(p, 'index.html'))) {
        buildPath = p;
        console.log(`[Server] ✅ Found valid build at: ${buildPath}`.green);
        break;
    }
}

console.log(`[Server] Final Build Path: ${buildPath}`);

// Serve static files
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
    // If it's an API request that wasn't caught, return 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API route not found" });
    }

    const indexPath = path.join(buildPath, 'index.html');
    
    // Check if it's an asset request that failed
    if (path.extname(req.path)) {
        console.log(`[Server] Asset 404: ${req.path}`.red);
        return res.status(404).type('text/plain').send(`Asset not found: ${req.path}`);
    }

    // Serve index.html for SPA routing
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.log(`[Server] index.html NOT found at ${indexPath}`.bgRed);
        res.status(200).send(`
            <div style="font-family: sans-serif; padding: 20px; text-align: center;">
                <h1 style="color: #2563eb;">Clinic-Desk API is running</h1>
                <p>The frontend build folder was not found.</p>
                <p>Expected location: <code>${buildPath}</code></p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666;">If you just deployed, please check the Render build logs to ensure <code>npm run build</code> finished successfully.</p>
            </div>
        `);
    }
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue);
});