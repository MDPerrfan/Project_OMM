import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import websiteInfoRouter from "./routes/websiteInfoRoute.js";

// App Config
const app = express();

// 1. Updated CORS configuration with ALL domain variations
const allowedOrigins = [
    "https://ommverse.vercel.app",
    "https://omm-admin.vercel.app",
    "https://ommverse.com",
    "https://www.ommverse.com", // Added www version
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
];

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// 2. Middlewares
app.use(express.json());

// Fixed CORS implementation
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); // Helps debugging in Vercel Logs
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
}));

// Api Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/website", websiteInfoRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});

// 3. Vercel Export
// In Serverless environments, we export the app instead of calling .listen()
export default app;