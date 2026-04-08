import express from "express";
import { getReviews, postReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.post("/", postReview);

export default reviewRouter;

