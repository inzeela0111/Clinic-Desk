import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";

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

// 3. STATIC FILES (Frontend Build)
// On Render, the build is usually in root/client/dist
const buildPath = path.resolve(process.cwd(), "client", "dist");
app.use(express.static(buildPath));

// 4. API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// 5. SPA ROUTING (CATCH-ALL)
// This must be AFTER all other routes
app.get(/.*/, (req, res) => {
    // If request starts with /api but didn't match any route above
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ message: "API endpoint not found" });
    }

    // Serve index.html for everything else
    const indexPath = path.join(buildPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send("Frontend build not found. Ensure 'npm run build' was successful.");
        }
    });
});

// 6. ERROR HANDLING
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});