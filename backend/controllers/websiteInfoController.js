import { v2 as cloudinary } from "cloudinary";
import websiteInfoModel from "../models/websiteInfoModel.js";

// Get website information
const getWebsiteInfo = async(req, res) => {
    try {
        let websiteInfo = await websiteInfoModel.findOne();

        // If no info exists, create default
        if (!websiteInfo) {
            websiteInfo = new websiteInfoModel({});
            await websiteInfo.save();
        }

        res.json({
            success: true,
            websiteInfo,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Update website information
const updateWebsiteInfo = async(req, res) => {
    try {
    const {
      storeAddress,
      phone,
      email,
      instagram,
      facebook,
      companyDescription,
      logo,
      heroImage,
      contactImage,
    } = req.body;

        // Handle image uploads if files are provided
        let logoUrl = logo;
        let heroImageUrl = heroImage;
        let contactImageUrl = contactImage;

        if (req.files) {
            // Helper function to upload with size check
            const uploadWithSizeCheck = async (file, fileType) => {
                try {
                    const fs = await import("fs");
                    const stats = fs.statSync(file.path);
                    const fileSizeInMB = stats.size / (1024 * 1024);
                    
                    if (fileSizeInMB > 10) {
                        throw new Error(`${fileType} file size (${fileSizeInMB.toFixed(2)}MB) exceeds 10MB limit. Please use a smaller file.`);
                    }

                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                } catch (error) {
                    if (error.http_code === 400 || error.message.includes("File size") || error.message.includes("too large")) {
                        throw new Error(`${fileType} file size is too large. Please use an image smaller than 10MB.`);
                    }
                    throw error;
                }
            };

            if (req.files.logo && req.files.logo[0]) {
                logoUrl = await uploadWithSizeCheck(req.files.logo[0], "Logo");
            }

            if (req.files.heroImage && req.files.heroImage[0]) {
                heroImageUrl = await uploadWithSizeCheck(req.files.heroImage[0], "Hero image");
            }

            if (req.files.contactImage && req.files.contactImage[0]) {
                contactImageUrl = await uploadWithSizeCheck(req.files.contactImage[0], "Contact image");
            }
        }

        // Get existing info or create new
        let websiteInfo = await websiteInfoModel.findOne();

        const updateData = {
            updatedAt: Date.now(),
        };

    if (storeAddress !== undefined) updateData.storeAddress = storeAddress;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (companyDescription !== undefined) updateData.companyDescription = companyDescription;
        if (logoUrl !== undefined) updateData.logo = logoUrl;
        if (heroImageUrl !== undefined) updateData.heroImage = heroImageUrl;
        if (contactImageUrl !== undefined) updateData.contactImage = contactImageUrl;

        if (!websiteInfo) {
            websiteInfo = new websiteInfoModel(updateData);
            await websiteInfo.save();
        } else {
            await websiteInfoModel.findOneAndUpdate({}, updateData);
        }

        res.json({
            success: true,
            message: "Website information updated",
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export { getWebsiteInfo, updateWebsiteInfo };