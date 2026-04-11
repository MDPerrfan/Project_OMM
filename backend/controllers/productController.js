import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for adding product
const addProduct = async(req, res) => {
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
            sizeChart,
        } = req.body;

        const files = Array.isArray(req.files) ?
            req.files :
            Object.values(req.files).flat();
        // Map through the files and upload to Cloudinary
        let imagesUrl = await Promise.all(
            files.map(async(item) => {
                try {
                    // Keep your size check logic
                    const fs = await
                    import ("fs");
                    const stats = fs.statSync(item.path);
                    const fileSizeInMB = stats.size / (1024 * 1024);

                    if (fileSizeInMB > 10) {
                        throw new Error(`File exceeds 10MB limit.`);
                    }

                    let result = await cloudinary.uploader.upload(item.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                } catch (error) {
                    throw new Error("Cloudinary Upload Failed: " + error.message);
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
            discountPercent: discountPercent !== undefined ? Number(discountPercent) : 0,
            sizeChart: sizeChart ? sizeChart : null,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        // Check for file size errors
        const errorMessage = error.message.includes("File size") || error.message.includes("too large") ?
            "File size is too large. Please use an image smaller than 10MB." :
            error.message;

        res.json({
            success: false,
            message: errorMessage,
        });
        console.log(error);
    }
};

const updateProduct = async(req, res) => {
    try {
        const { id, name, description, price, category, subCategory, bestseller, sizes, stock, discountPercent, sizeChart } = req.body;

        if (!id) return res.json({ success: false, message: "Product id is required" });

        // 1. Fetch current product to handle image array logic
        const product = await productModel.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (subCategory) updateData.subCategory = subCategory;
        if (price) updateData.price = Number(price);
        if (discountPercent !== undefined) updateData.discountPercent = Number(discountPercent);
        if (bestseller !== undefined) updateData.bestseller = bestseller === "true";

        if (sizes) updateData.sizes = JSON.parse(sizes);
        if (stock) updateData.stock = JSON.parse(stock);
        if (sizeChart !== undefined) updateData.sizeChart = sizeChart ? sizeChart : null;

        // 2. IMAGE REPLACEMENT LOGIC
        let currentImages = [...product.image]; // Start with existing images
        const newFiles = req.files; // Files sent from frontend

        if (newFiles && newFiles.length > 0) {
            // If you are sending files, we need to upload them to Cloudinary
            const uploadPromises = newFiles.map(async(file) => {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                return result.secure_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            // Logic: If the frontend sends 2 new images, we replace the first 2.
            // Or you can customize this to replace specific indices.
            uploadedUrls.forEach((url, index) => {
                if (index < currentImages.length) {
                    currentImages[index] = url; // Replace existing
                } else {
                    currentImages.push(url); // Add if new slot
                }
            });

            updateData.image = currentImages;
        }

        await productModel.findByIdAndUpdate(id, updateData);

        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for listing product
const listProducts = async(req, res) => {
    try {
        const products = await productModel.find({}).populate("sizeChart");
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
const removeProduct = async(req, res) => {
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
const singleProduct = async(req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId).populate("sizeChart");

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