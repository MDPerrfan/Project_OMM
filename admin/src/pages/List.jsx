import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  return (
    <>
      {updating && <Loading message="Updating..." />}
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Discount</b>
          <b>Stock</b>
          <b>Bestseller</b>
          <b className="text-center">Action</b>
        </div>
        {/* Product List */}
        {list.map((item, index) => {
          // Format stock display: "S:5 M:10 L:8" or "No stock"
          const stockDisplay = item.stock && Object.keys(item.stock).length > 0
            ? Object.entries(item.stock)
              .map(([size, count]) => `${size}:${count}`)
              .join(" ")
            : "No stock";

          return (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] ..."
            >
              <img className="w-12" src={item.image[0]} alt="product-image" />
              <p
                className="cursor-pointer underline-offset-2 hover:underline"
                onClick={async () => {
                  const newName = window.prompt("Edit product name", item.name);
                  if (newName === null || newName.trim() === "") return;
                  const newPrice = window.prompt(
                    "Edit product price",
                    String(item.price)
                  );
                  if (newPrice === null || newPrice.trim() === "") return;
                  try {
                    setUpdating(true);
                    const response = await axios.post(
                      backendUrl + "/api/product/update",
                      { id: item._id, name: newName.trim(), price: newPrice },
                      { headers: { token } }
                    );
                    if (response.data.success) {
                      toast.success("Product details updated");
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
                }}
              >
                {item.name}
              </p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <p
                className="cursor-pointer underline-offset-2 hover:underline"
                title="Click to update discount"
                onClick={async () => {
                  const current = item.discountPercent ?? 0;
                  const input = window.prompt("Set discount percentage (0-100)", String(current));
                  if (input === null) return;

                  const dp = Number(input);
                  if (isNaN(dp) || dp < 0 || dp > 100) {
                    toast.error("Discount must be a number between 0 and 100");
                    return;
                  }

                  try {
                    setUpdating(true);
                    const response = await axios.post(
                      backendUrl + "/api/product/update",
                      { id: item._id, discountPercent: dp },
                      { headers: { token } }
                    );
                    if (response.data.success) {
                      toast.success("Discount updated");
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
                }}
              >
                {item.discountPercent ? `${item.discountPercent}%` : "0%"}
              </p>

              <p
                className="cursor-pointer underline-offset-2 hover:underline text-xs"
                onClick={async () => {
                  const currentStock = item.stock || {};
                  let stockInput = "";

                  if (item.sizes && item.sizes.length > 0) {
                    const stockLines = item.sizes.map((size) => {
                      const current = currentStock[size] ?? 0;
                      return `${size}:${current}`;
                    });
                    stockInput = stockLines.join("\n");
                  }

                  const newStockStr = window.prompt(
                    `Update stock (one per line like: S:10)\nYou can add new sizes too (e.g. XL:0)\n\nCurrent:\n${stockInput || "No stock set"}`,
                    stockInput
                  );

                  if (newStockStr === null) return;

                  const newStock = {};
                  const lines = newStockStr.split("\n");

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    const [rawSize, rawCount] = trimmed.split(":").map((s) => s.trim());
                    if (!rawSize || rawCount === undefined) continue;

                    const size = rawSize.toUpperCase();
                    const count = Number(rawCount);

                    if (!Number.isNaN(count) && count >= 0) {
                      newStock[size] = count;
                    }
                  }

                  if (Object.keys(newStock).length === 0) {
                    toast.error("Please enter at least one size like S:10");
                    return;
                  }

                  const order = ["S", "M", "L", "XL", "XXL"];
                  const newSizes = Object.keys(newStock).sort((a, b) => {
                    const ai = order.indexOf(a);
                    const bi = order.indexOf(b);
                    if (ai === -1 && bi === -1) return a.localeCompare(b);
                    if (ai === -1) return 1;
                    if (bi === -1) return -1;
                    return ai - bi;
                  });

                  try {
                    const response = await axios.post(
                      backendUrl + "/api/product/update",
                      { id: item._id, stock: newStock, sizes: newSizes },
                      { headers: { token } }
                    );

                    if (response.data.success) {
                      toast.success("Stock & sizes updated");
                      fetchList();
                    } else {
                      toast.error(response.data.message);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                  }
                }}

                title="Click to update stock"
              >
                {stockDisplay}
              </p>
              <button
                onClick={async () => {
                  try {
                    setUpdating(true);
                    const response = await axios.post(
                      backendUrl + "/api/product/update",
                      { id: item._id, bestseller: !item.bestseller },
                      { headers: { token } }
                    );
                    if (response.data.success) {
                      toast.success(
                        item.bestseller
                          ? "Removed from bestseller"
                          : "Marked as bestseller"
                      );
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
                }}
                className={`px-2 py-1 rounded text-xs ${item.bestseller
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                {item.bestseller ? "Bestseller" : "Make Bestseller"}
              </button>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
