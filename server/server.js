import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import fs from "fs";

// Local Imports
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import runSlotAutomation from "./cron/slotCron.js";
import errorHandler from "./middleware/errorHandler.js";

// Setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. DATABASE
connectDB().then(() => {
    console.log("MongoDB Connected".cyan.underline);
    runSlotAutomation();
});

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. SMART STATIC PATH RESOLUTION
// This will work whether the Root Directory is set to '/' or 'server'
let buildPath = path.resolve(process.cwd(), "client", "dist");

// If we are running inside the 'server' folder, go up one level
if (!fs.existsSync(buildPath)) {
    buildPath = path.resolve(process.cwd(), "..", "client", "dist");
}

console.log(`[Deployment] Serving static files from: ${buildPath}`.green);
app.use(express.static(buildPath));

// 4. API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// 5. SPA ROUTING (CATCH-ALL)
app.get(/.*/, (req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ message: "API endpoint not found" });
    }

    const indexPath = path.join(buildPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).send(`
            <div style="font-family:sans-serif;text-align:center;padding:50px;">
                <h1 style="color:#2563eb;">Clinic-Desk API is Online</h1>
                <p>Frontend build missing at: <code>${buildPath}</code></p>
                <p><strong>Urgent Fix:</strong> Go to Render Settings and set 'Root Directory' to empty (delete 'server').</p>
            </div>
        `);
    }
});

// 6. ERROR HANDLING
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.yellow.bold);
});