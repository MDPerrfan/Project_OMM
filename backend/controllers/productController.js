import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for adding product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      stock,
      discountPercent,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          // Check file size (10MB limit)
          const fs = await import("fs");
          const stats = fs.statSync(item.path);
          const fileSizeInMB = stats.size / (1024 * 1024);
          
          if (fileSizeInMB > 10) {
            throw new Error(`File size (${fileSizeInMB.toFixed(2)}MB) exceeds 10MB limit. Please use a smaller file.`);
          }

          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        } catch (error) {
          // Handle Cloudinary errors
          if (error.http_code === 400 || error.message.includes("File size") || error.message.includes("too large")) {
            throw new Error("File size is too large. Please use an image smaller than 10MB.");
          }
          throw error;
        }
      })
    );

    // Parse stock data if provided
    let stockData = {};
    if (stock) {
      try {
        stockData = typeof stock === "string" ? JSON.parse(stock) : stock;
      } catch (e) {
        stockData = {};
      }
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes.replace(/'/g, '"')),
      stock: stockData,
      image: imagesUrl,
      discountPercent: discountPercent !== undefined ? Number(discountPercent) : 0,      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    // Check for file size errors
    const errorMessage = error.message.includes("File size") || error.message.includes("too large")
      ? "File size is too large. Please use an image smaller than 10MB."
      : error.message;
    
    res.json({
      success: false,
      message: errorMessage,
    });
    console.log(error);
  }
};

// function for updating product details (including bestseller and stock)
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      stock,
      discountPercent,
    } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: "Product id is required",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (subCategory !== undefined) updateData.subCategory = subCategory;
    if (price !== undefined) updateData.price = Number(price);
    if (bestseller !== undefined)
      updateData.bestseller =
        typeof bestseller === "string" ? bestseller === "true" : !!bestseller;
    if (sizes !== undefined) {
      // Allow sizes to come as JSON string or array
      if (typeof sizes === "string") {
        updateData.sizes = JSON.parse(sizes.replace(/'/g, '"'));
      } else {
        updateData.sizes = sizes;
      }
    }
    if (discountPercent !== undefined) {
      const dp = Number(discountPercent);
      updateData.discountPercent = isNaN(dp) ? 0 : Math.min(100, Math.max(0, dp));
    }
    
    if (stock !== undefined) {
      // Allow stock to come as JSON string or object
      if (typeof stock === "string") {
        try {
          updateData.stock = JSON.parse(stock);
        } catch (e) {
          updateData.stock = {};
        }
      } else {
        updateData.stock = stock;
      }
    }

    await productModel.findByIdAndUpdate(id, updateData);

    res.json({
      success: true,
      message: "Product updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for listing product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Product Removed",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for getting single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { listProducts, addProduct, updateProduct, removeProduct, singleProduct };
