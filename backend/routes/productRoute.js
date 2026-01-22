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

// Replace this:
// upload.fields([{name:'image1', maxCount:1}, ...])

// With this:
productRouter.post("/add", adminAuth, upload.array("images", 10), addProduct);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", adminAuth, singleProduct);
productRouter.post("/update", adminAuth, updateProduct);
productRouter.get("/list", listProducts);

export default productRouter;
