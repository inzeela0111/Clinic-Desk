import express from "express"
import dotenv from "dotenv"
import path from 'node:path';
import { fileURLToPath } from "url";
import colors from "colors"
import cors from "cors"
import connectDB from "./config/dbConfig.js"


//LOCAL IMPORTS
import authRoutes from "./routes/authRoutes.js" 
import doctorRoutes from "./routes/doctorRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import slotRoutes from "./routes/slotRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import "./cron/slotCron.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//DB connecion
connectDB()

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Dynamic frontend URL from Render
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// BODY PARSER (middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//default Route
// app.get("/" , (req , res) => {
//      res.json({
//         message : "WELCOME TO CLINIC-DESK API ....."
//      })
// })

//Routes Mounting
app.use("/api/auth", authRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/payments", paymentRoutes)



// Dashboard / Reports aliases matching standard
app.use("/api/dashboard", adminRoutes)
app.use("/api/reports", adminRoutes)


const buildPath = path.resolve(__dirname, '../client/dist');

// 5. Static File Serving & SPA Routing
if (process.env.NODE_ENV === "production") {
    // Serve static files from the build directory
    app.use(express.static(buildPath, {
        index: false // Disable automatic index.html serving to handle it via catch-all
    }));

    // Handle all other routes by serving index.html
    app.get("(*)", (req, res, next) => {
        // If the request is for an API route, skip to 404 handler
        if (req.path.startsWith('/api')) {
            return next();
        }
        
        // If the request looks like a static file (has an extension) and we're here, it means it wasn't found
        if (path.extname(req.path)) {
            return res.status(404).json({ success: false, message: "Asset not found" });
        }

        res.sendFile(path.join(buildPath, 'index.html'), (err) => {
            if (err) {
                console.error("Error sending index.html:", err);
                res.status(500).send("Build file index.html not found. Check logs.");
            }
        });
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running... (Development Mode)");
    });
}

// 404 Handler for API
app.use("/api/(*)", (req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
});











//ERROR HANDLER
app.use(errorHandler)

app.listen(PORT ,() => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
    console.log(`Static files path: ${buildPath}`.yellow)
})