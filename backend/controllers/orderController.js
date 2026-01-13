import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
// import Stripe from "stripe";

// Global variables
const currency = "usd";
const deliveryCharges = 10;

// gateway initialize
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order using COD
const placeOrder = async(req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const isValidUserObjectId = mongoose.Types.ObjectId.isValid(userId);

        const orderData = {
            userId: userId || null,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Only update cart if user is logged in
        if (isValidUserObjectId) {
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
        }

        // Emit new order notification to admin via Socket.io
        const io = req.app.get("io");
        if (io) {
            io.emit("newOrder", {
                orderId: newOrder._id,
                orderAmount: amount,
                orderItems: items.length,
                orderDate: newOrder.date,
                address: address,
                message: "New order placed!",
            });
        }

        res.json({
            success: true,
            message: "Order Placed",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Placing order using Stripe
/* const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
}; */

// verify stripe
/* const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartdata: {} });
      res.json({
        success: true,
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
}; */

// Placing order using Razorpay
/* const placeOrderRazorpay = async (req, res) => {}; */

// All orders data for admin panel
const allOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// User Order data for frontend
const userOrders = async(req, res) => {
    try {
        // userId can come from token (authenticated) or request body (guest)
        const userId = req.body.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID is required",
            });
        }

        const orders = await orderModel.find({ userId });
        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Update order status from admin panel
const updateStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;

        // Get the order to check previous status and items
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({
                success: false,
                message: "Order not found",
            });
        }

        const previousStatus = order.status;

        // Update order status
        await orderModel.findByIdAndUpdate(orderId, { status });

        // If status changed to "Delivered", reduce stock for each item
        if (status === "Delivered" && previousStatus !== "Delivered") {
            for (const item of order.items) {
                try {
                    const product = await productModel.findById(item._id);
                    if (product && product.stock && product.stock[item.size] !== undefined) {
                        // Reduce stock by the quantity ordered
                        const currentStock = product.stock[item.size] || 0;
                        const newStock = Math.max(0, currentStock - item.quantity);

                        await productModel.findByIdAndUpdate(
                            item._id, {
                                $set: {
                                    [`stock.${item.size}`]: newStock
                                }
                            }
                        );
                    }
                } catch (error) {
                    console.log(`Error updating stock for product ${item._id}:`, error);
                    // Continue with other items even if one fails
                }
            }
        }

        res.json({
            success: true,
            message: "Status Updated",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export {
    placeOrder,
    // placeOrderStripe,
    // placeOrderRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    // verifyStripe,
};