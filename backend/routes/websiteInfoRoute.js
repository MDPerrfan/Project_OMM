import express from "express";
import {
    getWebsiteInfo,
    updateWebsiteInfo,
} from "../controllers/websiteInfoController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const websiteInfoRouter = express.Router();

// Public route to get website info
websiteInfoRouter.get("/get", getWebsiteInfo);

// Admin route to update website info
websiteInfoRouter.post(
    "/update",
    adminAuth,
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "heroImage", maxCount: 1 },
        { name: "contactImage", maxCount: 1 },
        { name: "aboutImage", maxCount: 1 },
    ]),
    updateWebsiteInfo
);

export default websiteInfoRouter;