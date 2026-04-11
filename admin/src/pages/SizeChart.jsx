import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const SizeChart = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [sizeCharts, setSizeCharts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sizes: [{ size: "", measurements: {} }],
  });
  const [measurementKeys, setMeasurementKeys] = useState(["Chest", "Waist", "Length"]);
  const [newKey, setNewKey] = useState("");

  // Fetch size charts
  const fetchSizeCharts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/sizechart/list");
      if (response.data.success) {
        setSizeCharts(response.data.sizeCharts);
      }
    } catch (error) {
      toast.error("Failed to fetch size charts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizeCharts();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle size changes
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    if (field === "size") {
      newSizes[index].size = value;
    } else if (field.startsWith("measurement_")) {
      const key = field.replace("measurement_", "");
      newSizes[index].measurements[key] = value;
    }
    setFormData((prev) => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  // Add new size row
  const addSizeRow = () => {
    const newMeasurements = {};
    measurementKeys.forEach((key) => {
      newMeasurements[key] = "";
    });
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", measurements: newMeasurements }],
    }));
  };

  // Remove size row
  const removeSizeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  // Add measurement key
  const addMeasurementKey = () => {
    if (newKey.trim() && !measurementKeys.includes(newKey)) {
      setMeasurementKeys((prev) => [...prev, newKey]);
      // Add to all existing sizes
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.map((size) => ({
          ...size,
          measurements: { ...size.measurements, [newKey]: "" },
        })),
      }));
      setNewKey("");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("Please enter size chart name");
    }

    if (formData.sizes.some((s) => !s.size.trim())) {
      return toast.error("Please fill all size fields");
    }

    try {
      setLoading(true);
      const url = editingId
        ? backendUrl + `/api/sizechart/${editingId}`
        : backendUrl + "/api/sizechart/add";

      const method = editingId ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSizeCharts();
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit size chart
  const handleEdit = (chart) => {
    setEditingId(chart._id);
    setFormData({
      name: chart.name,
      description: chart.description,
      sizes: chart.sizes,
    });
    setShowForm(true);
  };

  // Delete size chart
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size chart?")) {
      try {
        const response = await axios.delete(backendUrl + `/api/sizechart/${id}`, {
          headers: { token },
        });
        if (response.data.success) {
          toast.success("Size chart deleted");
          fetchSizeCharts();
        }
      } catch (error) {
        toast.error("Failed to delete size chart");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sizes: [{ size: "", measurements: {} }],
    });
    setEditingId(null);
    setShowForm(false);
    setMeasurementKeys(["Chest", "Waist", "Length"]);
  };

  return (
    <div className="w-full">
      {loading && <Loading message="Processing..." />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Size Charts</h1>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add Size Chart"}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded mb-6 border border-gray-200"
        >
          <div className="grid gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Size Chart Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g., Men's Shirts, Women's Dresses"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Optional description"
                rows="2"
              />
            </div>

            {/* Measurement Keys */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Measurement Types
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {measurementKeys.map((key) => (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm"
                  >
                    {key}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Add new measurement type"
                  className="flex-1 border px-3 py-2 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={addMeasurementKey}
                  className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Sizes Table */}
            <div>
              <label className="block text-sm font-medium mb-2">Sizes *</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-2 py-2 text-left">Size</th>
                      {measurementKeys.map((key) => (
                        <th key={key} className="border px-2 py-2 text-left">
                          {key}
                        </th>
                      ))}
                      <th className="border px-2 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.sizes.map((sizeData, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-2">
                          <input
                            type="text"
                            value={sizeData.size}
                            onChange={(e) =>
                              handleSizeChange(idx, "size", e.target.value)
                            }
                            placeholder="e.g., S, M, L, XL"
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        {measurementKeys.map((key) => (
                          <td key={key} className="border px-2 py-2">
                            <input
                              type="text"
                              value={sizeData.measurements[key] || ""}
                              onChange={(e) =>
                                handleSizeChange(
                                  idx,
                                  `measurement_${key}`,
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 34-36"
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                        ))}
                        <td className="border px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeSizeRow(idx)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={addSizeRow}
                className="mt-3 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
              >
                Add Size Row
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update" : "Create"} Size Chart
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Size Charts List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Size Charts</h2>
        {sizeCharts.length === 0 ? (
          <p className="text-gray-500">No size charts created yet.</p>
        ) : (
          <div className="grid gap-4">
            {sizeCharts.map((chart) => (
              <div
                key={chart._id}
                className="border rounded p-4 bg-white hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{chart.name}</h3>
                    {chart.description && (
                      <p className="text-gray-600 text-sm">{chart.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(chart)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chart._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Size</th>
                        {Object.keys(chart.sizes[0]?.measurements || {}).map(
                          (key) => (
                            <th key={key} className="border px-2 py-1 text-left">
                              {key}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {chart.sizes.map((sizeData, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{sizeData.size}</td>
                          {Object.entries(sizeData.measurements).map(
                            ([key, value]) => (
                              <td key={key} className="border px-2 py-1">
                                {value}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChart;
