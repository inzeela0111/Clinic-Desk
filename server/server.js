import express from "express"
import dotenv from "dotenv"
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


dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

//DB connecion
connectDB()

//CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//BODY PARSER (middleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//default Route
app.get("/" , (req , res) => {
     res.json({
        message : "WELCOME TO CLINIC-DESK API ....."
     })
})

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


//ERROR HANDLER
app.use(errorHandler)

app.listen(PORT ,() => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})