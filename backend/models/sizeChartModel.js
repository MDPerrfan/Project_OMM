import mongoose from "mongoose";

const sizeChartSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  // Array of sizes with measurements
  // Example: [{ size: "S", chest: "34-36", waist: "28-30", length: "28" }, ...]
  sizes: [
    {
      size: { type: String, required: true },
      measurements: { type: Object, default: {} }, // Dynamic measurements like {chest: "34-36", waist: "28-30", length: "28"}
    },
  ],
  date: { type: Number, required: true },
});

const sizeChartModel =
  mongoose.models.sizeChart || mongoose.model("sizeChart", sizeChartSchema);

export default sizeChartModel;
