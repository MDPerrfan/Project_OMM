import sizeChartModel from "../models/sizeChartModel.js";

// Add a new size chart
const addSizeChart = async (req, res) => {
  try {
    const { name, description, sizes } = req.body;

    if (!name || !sizes || sizes.length === 0) {
      return res.json({
        success: false,
        message: "Please provide name and at least one size with measurements",
      });
    }

    const sizeChart = new sizeChartModel({
      name,
      description: description || "",
      sizes,
      date: Date.now(),
    });

    await sizeChart.save();

    res.json({
      success: true,
      message: "Size chart added successfully",
      sizeChart,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get all size charts
const getAllSizeCharts = async (req, res) => {
  try {
    const sizeCharts = await sizeChartModel.find().sort({ date: -1 });

    res.json({
      success: true,
      sizeCharts,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single size chart by ID
const getSizeChart = async (req, res) => {
  try {
    const { id } = req.params;

    const sizeChart = await sizeChartModel.findById(id);

    if (!sizeChart) {
      return res.json({
        success: false,
        message: "Size chart not found",
      });
    }

    res.json({
      success: true,
      sizeChart,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update a size chart
const updateSizeChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sizes } = req.body;

    if (!name || !sizes || sizes.length === 0) {
      return res.json({
        success: false,
        message: "Please provide name and at least one size with measurements",
      });
    }

    const sizeChart = await sizeChartModel.findByIdAndUpdate(
      id,
      {
        name,
        description: description || "",
        sizes,
      },
      { new: true }
    );

    if (!sizeChart) {
      return res.json({
        success: false,
        message: "Size chart not found",
      });
    }

    res.json({
      success: true,
      message: "Size chart updated successfully",
      sizeChart,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a size chart
const deleteSizeChart = async (req, res) => {
  try {
    const { id } = req.params;

    const sizeChart = await sizeChartModel.findByIdAndDelete(id);

    if (!sizeChart) {
      return res.json({
        success: false,
        message: "Size chart not found",
      });
    }

    res.json({
      success: true,
      message: "Size chart deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addSizeChart,
  getAllSizeCharts,
  getSizeChart,
  updateSizeChart,
  deleteSizeChart,
};
