import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    isGuest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ user_id: 1, createdAt: -1 });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;

