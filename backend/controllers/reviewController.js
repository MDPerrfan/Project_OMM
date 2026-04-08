import jwt from "jsonwebtoken";
import reviewModel from "../models/reviewModel.js";

const GUEST_REVIEW_COOLDOWN_HOURS = 24;

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const postReview = async (req, res) => {
  try {
    const { name, rating, comment, userId, guestId, unique_id } = req.body;
    const token = req.headers.token;

    let resolvedUserId = userId || null;
    let isGuest = true;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        resolvedUserId = decoded.id;
        isGuest = false;
      } catch (error) {
        // If token is invalid, continue as guest using guest id.
      }
    }

    if (!resolvedUserId) {
      resolvedUserId = guestId || unique_id;
      isGuest = true;
    }

    if (!resolvedUserId) {
      return res.json({
        success: false,
        message: "A valid user identifier is required.",
      });
    }

    if (!name || !comment || rating === undefined || rating === null) {
      return res.json({
        success: false,
        message: "Name, rating and comment are required.",
      });
    }

    const safeRating = Number(rating);
    if (Number.isNaN(safeRating) || safeRating < 1 || safeRating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Basic anti-spam for guests: allow 1 review per 24h per unique guest id.
    if (isGuest) {
      const minCreatedAt = new Date(
        Date.now() - GUEST_REVIEW_COOLDOWN_HOURS * 60 * 60 * 1000
      );

      const recentGuestReview = await reviewModel.findOne({
        user_id: resolvedUserId,
        isGuest: true,
        createdAt: { $gte: minCreatedAt },
      });

      if (recentGuestReview) {
        return res.json({
          success: false,
          message: `Guest reviews are limited to one every ${GUEST_REVIEW_COOLDOWN_HOURS} hours.`,
        });
      }
    }

    const newReview = new reviewModel({
      user_id: resolvedUserId,
      name: String(name).trim(),
      rating: safeRating,
      comment: String(comment).trim(),
      isGuest,
    });

    await newReview.save();

    res.json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getReviews, postReview };

