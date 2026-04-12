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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    if (field === "size") {
      newSizes[index].size = value;
    } else if (field.startsWith("measurement_")) {
      const key = field.replace("measurement_", "");
      newSizes[index].measurements[key] = value;
    }
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const addSizeRow = () => {
    const newMeasurements = {};
    measurementKeys.forEach((key) => { newMeasurements[key] = ""; });
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", measurements: newMeasurements }],
    }));
  };

  const removeSizeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const addMeasurementKey = () => {
    if (newKey.trim() && !measurementKeys.includes(newKey.trim())) {
      const trimmed = newKey.trim();
      setMeasurementKeys((prev) => [...prev, trimmed]);
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.map((size) => ({
          ...size,
          measurements: { ...size.measurements, [trimmed]: "" },
        })),
      }));
      setNewKey("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMeasurementKey();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Please enter size chart name");
    if (formData.sizes.some((s) => !s.size.trim())) return toast.error("Please fill all size fields");

    try {
      setLoading(true);
      const url = editingId
        ? backendUrl + `/api/sizechart/${editingId}`
        : backendUrl + "/api/sizechart/add";
      const method = editingId ? "put" : "post";

      const response = await axios({ method, url, data: formData, headers: { token } });
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

  const handleEdit = (chart) => {
    setEditingId(chart._id);
    setFormData({ name: chart.name, description: chart.description, sizes: chart.sizes });
    const keys = Object.keys(chart.sizes[0]?.measurements || {});
    if (keys.length) setMeasurementKeys(keys);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size chart?")) {
      try {
        const response = await axios.delete(backendUrl + `/api/sizechart/${id}`, { headers: { token } });
        if (response.data.success) {
          toast.success("Size chart deleted");
          fetchSizeCharts();
        }
      } catch (error) {
        toast.error("Failed to delete size chart");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", sizes: [{ size: "", measurements: {} }] });
    setEditingId(null);
    setShowForm(false);
    setMeasurementKeys(["Chest", "Waist", "Length"]);
  };

  return (
    /* 
      Key fix: `min-w-0` on the root prevents the flex/grid child from overflowing
      its parent. Combined with `w-full box-border` on all inputs, this ensures
      nothing bleeds outside the viewport on mobile.
    */
    <div className="w-full min-w-0 max-w-2xl mx-auto px-3 sm:px-4 md:px-0">
      {loading && <Loading message="Processing..." />}

      {/* Header */}
      <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Size Charts</h1>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          {showForm ? "Cancel" : "Add Size Chart"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-3 sm:p-6 rounded mb-6 border border-gray-200 overflow-hidden"
        >
          {/* `min-w-0` on the grid container prevents children from stretching it */}
          <div className="grid gap-4 min-w-0">

            {/* Name */}
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Size Chart Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                /*
                  `box-border` ensures padding is included in the width calculation,
                  preventing inputs from exceeding their container.
                */
                className="w-full box-border border px-3 py-2 rounded text-sm"
                placeholder="e.g., Men's Shirts, Women's Dresses"
              />
            </div>

            {/* Description */}
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full box-border border px-3 py-2 rounded text-sm resize-none"
                placeholder="Optional description"
                rows="2"
              />
            </div>

            {/* Measurement Keys */}
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-2">Measurement Types</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {measurementKeys.map((key) => (
                  <span key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {key}
                  </span>
                ))}
              </div>
              {/* 
                Use `min-w-0` on the flex container so the input can shrink.
                The input has `min-w-0` too so it won't refuse to shrink below
                its default minimum content width.
              */}
              <div className="flex gap-2 min-w-0">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add measurement type"
                  className="flex-1 min-w-0 box-border border px-3 py-2 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={addMeasurementKey}
                  className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Sizes */}
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-2">Sizes *</label>
              <div className="grid gap-3 min-w-0">
                {formData.sizes.map((sizeData, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-white min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Size #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSizeRow(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Size label */}
                    <div className="mb-3 min-w-0">
                      <label className="block text-xs text-gray-500 mb-1.5">Size Label</label>
                      <input
                        type="text"
                        value={sizeData.size}
                        onChange={(e) => handleSizeChange(idx, "size", e.target.value)}
                        placeholder="e.g., S, M, L, XL"
                        className="w-full box-border px-3 py-2 border rounded text-sm"
                      />
                    </div>

                    {/* Measurements */}
                    {measurementKeys.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                        {measurementKeys.map((key) => (
                          <div key={key} className="min-w-0">
                            <label className="block text-xs text-gray-500 mb-1">{key}</label>
                            <input
                              type="text"
                              value={sizeData.measurements[key] || ""}
                              onChange={(e) => handleSizeChange(idx, `measurement_${key}`, e.target.value)}
                              placeholder="e.g., 34-36"
                              className="w-full box-border px-3 py-2 border rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSizeRow}
                className="mt-3 w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              >
                + Add Size Row
              </button>
            </div>

            {/* Submit */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
              >
                {editingId ? "Update" : "Create"} Size Chart
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Size Charts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Size Charts</h2>
        {sizeCharts.length === 0 ? (
          <p className="text-gray-500 text-sm">No size charts created yet.</p>
        ) : (
          <div className="grid gap-4">
            {sizeCharts.map((chart) => (
              <div key={chart._id} className="border rounded-lg p-4 bg-white hover:shadow-lg transition">
                <div className="flex flex-wrap gap-2 justify-between items-start mb-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold">{chart.name}</h3>
                    {chart.description && (
                      <p className="text-gray-500 text-sm">{chart.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(chart)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(chart._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* 
  FIX: Derive column headers from ALL rows (not just sizes[0]),
  then look up each value by key explicitly instead of relying
  on Object.entries() order — which breaks when rows have
  different keys or different key ordering in the stored data.
*/}

                {/* Table preview (sm+) */}
                <div className="hidden sm:block overflow-x-auto">
                  {(() => {
                    // Collect every unique measurement key across ALL size rows
                    const allKeys = Array.from(
                      new Set(
                        chart.sizes.flatMap((s) => Object.keys(s.measurements || {}))
                      )
                    );
                    return (
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-2 py-1 text-left">Size</th>
                            {allKeys.map((key) => (
                              <th key={key} className="border px-2 py-1 text-left">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {chart.sizes.map((sizeData, idx) => (
                            <tr key={idx} className="even:bg-gray-50">
                              <td className="border px-2 py-1 font-medium">{sizeData.size}</td>
                              {/* Explicit key lookup — never depends on entry order */}
                              {allKeys.map((key) => (
                                <td key={key} className="border px-2 py-1">
                                  {sizeData.measurements?.[key] ?? ""}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>

                {/* Mobile preview — stacked cards */}
                <div className="sm:hidden grid gap-2">
                  {(() => {
                    const allKeys = Array.from(
                      new Set(
                        chart.sizes.flatMap((s) => Object.keys(s.measurements || {}))
                      )
                    );
                    return chart.sizes.map((sizeData, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-2 text-xs">
                        <span className="font-semibold text-gray-700">Size: {sizeData.size}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-gray-600">
                          {allKeys.map((key) => (
                            <span key={key}>
                              {key}: <span className="font-medium">{sizeData.measurements?.[key] ?? "—"}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
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