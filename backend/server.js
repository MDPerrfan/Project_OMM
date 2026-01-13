import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
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
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
    "https://ommverse.vercel.app",
    "https://omm-admin.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
];

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Make io available globally for use in controllers
app.set("io", io);

// Connect DB
connectDB();

// Connect Cloudinary
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
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

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Server started at port ${port}`);
});