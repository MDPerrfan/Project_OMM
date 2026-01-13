import express from "express";
import jwt from "jsonwebtoken";
import {
    placeOrder,
    // placeOrderStripe,
    // placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    // verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment features
// Allow placing orders without login
// If token is present, extract userId from token, otherwise use userId from body
orderRouter.post("/place", async(req, res, next) => {
    const { token } = req.headers;

    if (token) {
        // User is authenticated, extract userId from token
        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
            req.body.userId = tokenDecode.id;
        } catch (error) {
            // If token is invalid, proceed without it (guest user)
        }
    }
    // If no token, userId should come from request body (guestId)
    next();
}, placeOrder);
// orderRouter.post("/stripe", authUser, placeOrderStripe);
// orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Features - Allow guest users to fetch orders using guestId
// If token is present, extract userId from token, otherwise use userId from body
orderRouter.post("/userorders", async(req, res, next) => {
    const { token } = req.headers;

    if (token) {
        // User is authenticated, extract userId from token
        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
            req.body.userId = tokenDecode.id;
        } catch (error) {
            // If token is invalid, proceed without it (guest user)
        }
    }
    // If no token, userId should come from request body (guestId)
    next();
}, userOrders);

// verify payment
// orderRouter.post("/verifyStripe", authUser, verifyStripe);

export default orderRouter;