import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Which row is expanded for editing
  const [editingId, setEditingId] = useState(null);

  // Edit form state (for the expanded row only)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    discountPercent: 0,
    sizes: [],
    stock: {}, // {S:10,...}
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      setUpdating(true);
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openEditor = (item) => {
    const stock = item.stock || {};
    const sizes = Array.isArray(item.sizes) ? item.sizes : [];

    // Make sure stock has keys for sizes
    const normalizedStock = { ...stock };
    sizes.forEach((s) => {
      if (normalizedStock[s] === undefined) normalizedStock[s] = 0;
    });

    setEditingId(item._id);
    setEditForm({
      name: item.name || "",
      price: String(item.price ?? ""),
      discountPercent: Number(item.discountPercent || 0),
      sizes: sizes,
      stock: normalizedStock,
    });
  };

  const closeEditor = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      price: "",
      discountPercent: 0,
      sizes: [],
      stock: {},
    });
  };

  const toggleSize = (size) => {
    setEditForm((prev) => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];

      // Keep stock aligned
      const newStock = { ...prev.stock };
      if (!exists) {
        // add size -> init stock
        if (newStock[size] === undefined) newStock[size] = 0;
      } else {
        // remove size -> remove stock key
        delete newStock[size];
      }

      // Keep order nice: S M L XL XXL
      const ordered = SIZE_OPTIONS.filter((s) => newSizes.includes(s));

      return { ...prev, sizes: ordered, stock: newStock };
    });
  };

  const updateStock = (size, value) => {
    const num = value === "" ? "" : Math.max(0, Number(value) || 0);
    setEditForm((prev) => ({
      ...prev,
      stock: { ...prev.stock, [size]: num === "" ? 0 : num }, // allow typing empty, store 0
    }));
  };

  const saveEdits = async (id) => {
    // Basic validations
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const priceNum = Number(editForm.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Price must be a valid number");
      return;
    }
    const dp = Number(editForm.discountPercent);
    if (Number.isNaN(dp) || dp < 0 || dp > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }
    if (!editForm.sizes.length) {
      toast.error("Select at least one size");
      return;
    }

    // Ensure stock only includes selected sizes
    const newStock = {};
    editForm.sizes.forEach((s) => {
      newStock[s] = Math.max(0, Number(editForm.stock[s] ?? 0) || 0);
    });

    try {
      setUpdating(true);
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          id,
          name: editForm.name.trim(),
          price: priceNum,
          discountPercent: dp,
          sizes: editForm.sizes,
          stock: newStock,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated");
        closeEditor();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const toggleBestseller = async (item) => {
    try {
      setUpdating(true);
      const response = await axios.post(
        backendUrl + "/api/product/update",
        { id: item._id, bestseller: !item.bestseller },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(item.bestseller ? "Removed from bestseller" : "Marked as bestseller");
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Loading products..." />;

  return (
    <>
      {updating && <Loading message="Updating..." />}
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Discount</b>
          <b>Stock</b>
          <b>Bestseller</b>
          <b className="text-center">Action</b>
        </div>

        {list.map((item) => {
          const stockDisplay =
            item.stock && Object.keys(item.stock).length > 0
              ? Object.entries(item.stock)
                  .map(([size, count]) => `${size}:${count}`)
                  .join(" ")
              : "No stock";

          const isEditing = editingId === item._id;

          return (
            <div key={item._id} className="border rounded-md bg-white">
              {/* Row */}
              <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 text-sm">
                <img className="w-12 h-12 object-cover rounded" src={item.image?.[0]} alt="product" />

                <p className="font-medium text-gray-800 truncate">{item.name}</p>

                <p className="hidden md:block">{item.category}</p>

                <p>
                  {currency}
                  {item.price}
                </p>

                <p className="hidden md:block">{item.discountPercent ? `${item.discountPercent}%` : "0%"}</p>

                <p className="hidden md:block text-xs text-gray-600 truncate" title={stockDisplay}>
                  {stockDisplay}
                </p>

                <button
                  onClick={() => toggleBestseller(item)}
                  className={`px-2 py-1 rounded text-xs w-fit ${
                    item.bestseller ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.bestseller ? "Bestseller" : "Make Bestseller"}
                </button>

                <div className="flex items-center justify-end md:justify-center gap-2">
                  <button
                    onClick={() => (isEditing ? closeEditor() : openEditor(item))}
                    className="px-3 py-1 rounded text-xs bg-black text-white"
                  >
                    {isEditing ? "Close" : "Edit"}
                  </button>

                  <button
                    onClick={() => removeProduct(item._id)}
                    className="px-3 py-1 rounded text-xs bg-red-50 text-red-700"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {isEditing && (
                <div className="border-t px-3 py-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Name */}
                    <div>
                      <p className="text-xs mb-1">Name</p>
                      <input
                        className="w-full px-3 py-2 border rounded"
                        value={editForm.name}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-xs mb-1">Price</p>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border rounded"
                        value={editForm.price}
                        onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <p className="text-xs mb-1">Discount (%)</p>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded"
                        value={editForm.discountPercent}
                        onChange={(e) =>
                          setEditForm((p) => ({ ...p, discountPercent: Number(e.target.value) || 0 }))
                        }
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mt-4">
                    <p className="text-xs mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {SIZE_OPTIONS.map((s) => {
                        const selected = editForm.sizes.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSize(s)}
                            className={`px-3 py-1 rounded border text-sm ${
                              selected ? "bg-orange-50 border-orange-400 text-orange-700" : "bg-white"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stock */}
                  {editForm.sizes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs mb-2">Stock (0 means unavailable)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {editForm.sizes.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="w-10 font-medium text-sm">{s}</span>
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border rounded"
                              value={editForm.stock[s] ?? 0}
                              onChange={(e) => updateStock(s, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2 justify-end">
                    <button
                      onClick={closeEditor}
                      className="px-4 py-2 rounded border bg-white text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdits(item._id)}
                      className="px-4 py-2 rounded bg-black text-white text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
