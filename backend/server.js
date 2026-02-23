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

const app = express();

// Allowed origins
const allowedOrigins = [
    "https://ommverse.vercel.app",
    "https://omm-admin.vercel.app",
    "https://ommverse.com",
    "https://www.ommverse.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://omm-admin.netlify.app",
];

// Connect services
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// ✅ Single, normalized CORS config
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        try {
            const normalizedOrigin = new URL(origin).origin;

            if (
                allowedOrigins.includes(normalizedOrigin) ||
                normalizedOrigin.endsWith(".vercel.app")
            ) {
                return callback(null, true);
            }

            console.log("Blocked by CORS:", normalizedOrigin);
            return callback(new Error("Not allowed by CORS"));
        } catch (err) {
            console.log("Invalid origin:", origin);
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/website", websiteInfoRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
export default app;