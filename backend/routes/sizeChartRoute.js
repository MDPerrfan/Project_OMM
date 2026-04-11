import express from "express";
import {
  addSizeChart,
  getAllSizeCharts,
  getSizeChart,
  updateSizeChart,
  deleteSizeChart,
} from "../controllers/sizeChartController.js";
import adminAuth from "../middlewares/adminAuth.js";

const sizeChartRoute = express.Router();

// Admin routes (protected)
sizeChartRoute.post("/add", adminAuth, addSizeChart);
sizeChartRoute.get("/list", getAllSizeCharts);
sizeChartRoute.get("/:id", getSizeChart);
sizeChartRoute.put("/:id", adminAuth, updateSizeChart);
sizeChartRoute.delete("/:id", adminAuth, deleteSizeChart);

export default sizeChartRoute;
