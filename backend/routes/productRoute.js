import express from "express";
import {
    listProducts,
    removeProduct,
    singleProduct,
    addProduct,
    updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const productRouter = express.Router();


productRouter.post("/add", adminAuth, upload.array("images", 10), addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", adminAuth, singleProduct);
productRouter.post('/update', upload.array('images', 8), adminAuth, updateProduct);
productRouter.get("/list", listProducts);

export default productRouter;