import React, { useState, useEffect } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import imageCompression from "browser-image-compression"; 

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState({});
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeCharts, setSizeCharts] = useState([]);

  // Fetch size charts on component mount
  useEffect(() => {
    const fetchSizeCharts = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/sizechart/list");
        if (response.data.success) {
          setSizeCharts(response.data.sizeCharts);
        }
      } catch (error) {
        console.log("Failed to fetch size charts");
      }
    };
    fetchSizeCharts();
  }, []);
  const [sizeChart, setSizeChart] = useState(null);
  const [sizeCharts, setSizeCharts] = useState([]);

  const handleImageCompression = async (file) => {
    if (!file) return null;
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      return file;
    }
  };

  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 8) {
      toast.error("You can only upload up to 8 images");
  
      setImages(selectedFiles.slice(0, 8));
    } else {
      setImages(selectedFiles);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.p
      if (sizeChart) {
        formData.append("sizeChart", sizeChart);
      }reventDefault();
      if (images.length === 0) {
        return toast.error("Please upload at least one image");
      }
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPercent", discountPercent);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", JSON.stringify(
        Object.fromEntries(Object.entries(stock).map(([k, v]) => [k, Number(v) || 0]))
      ));

    
      for (let i = 0; i < images.length; i++) {
        const compressed = await handleImageCompression(images[i]);
        formData.append("images", compressed);
      }
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImages([]);
        setPrice("");
        setSizeChart(null);
        setDiscountPercent(0);
        setSizes([]);
        setStock({});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading message="Optimizing & Adding product..." />}
      <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
        <div>
          <p className="mb-2">Upload Images (Max x 8)</p>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer border-2 border-dashed border-gray-300 p-4 w-40 h-40 flex flex-col items-center justify-center hover:bg-gray-50" htmlFor="images">
              <img className="w-10 mb-2" src={assets.upload_area} alt="" />
              <p className="text-xs text-gray-500 text-center">Click to select up to 8 photos</p>
              <input
                onChange={onFileChange}
                type="file"
                id="images"
                hidden
                multiple 
                accept="image/*"
              />
            </label>

            {/*Preview the selected images */}
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  className="w-40 h-40 object-cover border"
                  src={URL.createObjectURL(img)}
                  alt="preview"
                />
                <span className="absolute top-0 right-0 bg-black text-white text-xs px-2 py-1">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input className="w-full max-w-[500px] px-3 py-2 border" type="text" placeholder="Type Here" onChange={(e) => setName(e.target.value)} value={name} required />
        </div>

        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea className="w-full max-w-[500px] px-3 py-2 border" placeholder="Add Product Description" onChange={(e) => setDescription(e.target.value)} value={description} required />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Product Category</p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full px-3 py-2 border">
              <option value="Men">Men</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Sub Category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="w-full px-3 py-2 border">
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Product Price</p>
            <input className="w-full px-3 py-2 sm:w-[120px] border" type="number" placeholder="25" onChange={(e) => setPrice(e.target.value)} value={price} required />
          </div>
          <div>
            <p className="mb-2">Discount (%)</p>
            <input className="w-full px-3 py-2 sm:w-[120px] border" type="number" min="0" max="100" onChange={(e) => setDiscountPercent(e.target.value)} value={discountPercent} />
          </div>
        </div>

        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <p
                key={size}
                onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(i => i !== size) : [...prev, size])}
                className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            ))}
          </div>
        </div>

        {sizes.length > 0 && (
          <div>
            <p className="mb-2">Stock Count for Each Size</p>
            <div className="flex flex-col gap-2">
              {sizes.map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <label className="w-12 font-medium">Size {size}:</label>
                  <input
                    className="w-32 px-3 py-2 border"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock[size] ?? ""}
                    onChange={(e) => setStock(prev => ({ ...prev, [size]: e.target.value === "" ? "" : Number(e.target.value) }))}
                    required
                  />
                  <span className="text-sm text-gray-500">units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full">
          <p className="mb-2">Size Chart (Optional)</p>
          <select 
            onChange={(e) => setSizeChart(e.target.value || null)} 
            value={sizeChart || ""} 
            className="w-full max-w-[500px] px-3 py-2 border"
          >
            <option value="">-- Select a Size Chart --</option>
            {sizeCharts.map((chart) => (
              <option key={chart._id} value={chart._id}>{chart.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Customers will be able to view this size chart on the product page</p>
        </div>

        <div className="flex gap-2 mt-2">
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
          <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button className="w-28 py-3 mt-4 bg-black text-white disabled:opacity-50" type="submit" disabled={loading}>
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </>
  );
};

export default Add;