import express from "express"
import dotenv from "dotenv"
import path from 'path';
import { fileURLToPath } from 'url';
import colors from "colors"
import cors from "cors"

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
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...', err.name, err.message);
    process.exit(1);
});

// DB Connection
connectDB().then(() => {
    console.log("Database connected successfully, initializing automation...".green);
    runSlotAutomation();
}).catch(err => {
    console.error("CRITICAL: Database connection failed during startup:".red, err.message);
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

// Routes Mounting
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);

// Dashboard / Reports aliases
app.use("/api/dashboard", adminRoutes);
app.use("/api/reports", adminRoutes);

// Static File Serving & SPA Routing for Production
const buildPath = path.resolve(__dirname, '../client/dist');

if (process.env.NODE_ENV === "production") {
    app.use(express.static(buildPath));

    app.get(/.*/, (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    // Health Check for Dev
    app.get("/", (req, res) => {
        res.status(200).json({ success: true, message: "Clinic-Desk API is alive and kicking (Dev)!" });
    });
}

// 404 Handler for API
app.use("/api", (req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue);
});