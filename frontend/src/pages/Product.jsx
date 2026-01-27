import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import Loading from "../components/Loading";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, loadingProducts } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // 🔍 Zoom state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const fetchProductData = () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  //  Lock scroll when zoom open
  useEffect(() => {
    document.body.style.overflow = isZoomOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isZoomOpen]);

  if (loadingProducts) {
    return <Loading message="Loading product..." />;
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity duration-500 opacity-100">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-auto sm:w-[18.7%]">
            {productData.image.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer"
                onClick={() => setImage(img)}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt=""
              className="w-full cursor-zoom-in"
              onClick={() => {
                setIsZoomOpen(true);
                setZoomLevel(1);
                setPosition({ x: 0, y: 0 });
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">
            {productData.name}
          </h1>

          {/*  Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <svg
              className="w-3.5 h-3.5 text-gray-300 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>

          {/*  Price */}
          {(() => {
            const dp = Number(productData.discountPercent || 0);
            const hasDiscount = dp > 0;
            const discountedPrice = hasDiscount
              ? Math.round(productData.price * (1 - dp / 100))
              : productData.price;

            return (
              <div className="mt-5 flex items-end gap-3">
                <p className="text-3xl font-medium">
                  {currency}
                  {discountedPrice}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-lg text-gray-500 line-through">
                      {currency}
                      {productData.price}
                    </p>
                    <span className="text-sm font-medium text-green-600">
                      -{dp}%
                    </span>
                  </>
                )}
              </div>
            );
          })()}

          <div className="mt-5 md:w-4/5">
            {(() => {
              const lines = productData.description
                .split("\n")
                .filter(line => line.trim() !== "");

              if (!lines.length) return null;

              const [headline, ...rest] = lines;

              return (
                <>
                  {/*  First line (headline) */}
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {headline}
                  </p>

                  {/* 📄 Remaining description */}
                  <div className="text-gray-600 space-y-4 leading-relaxed">
                    {rest.map((line, i) => (
                      <p key={i} className="first-letter:text-orange-600 first-letter:text-2xl first-letter:font-bold">
                        {line}
                      </p>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>



          {/* 📦 Sizes */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>

            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, i) => {
                const stockCount =
                  productData.stock && productData.stock[item] !== undefined
                    ? productData.stock[item]
                    : null;

                const isOutOfStock = stockCount === 0 || stockCount === null;
                const isSelected = size === item;

                return (
                  <button
                    key={i}
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && setSize(item)}
                    className={`border py-2 px-4 relative overflow-hidden ${isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                      : isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    title={
                      isOutOfStock
                        ? "Not available"
                        : `Stock: ${stockCount}`
                    }
                  >
                    {item}

                    {/* ✅ STOCK COUNT */}
                    {stockCount !== null && (
                      <span
                        className={`ml-2 text-xs ${isOutOfStock
                          ? "text-gray-400"
                          : "text-gray-600"
                          }`}
                      >
                        ({stockCount})
                      </span>
                    )}

                    {/* ❌ Diagonal line if out of stock */}
                    {isOutOfStock && (
                      <span className="pointer-events-none absolute left-[-20%] top-1/2 h-[2px] w-[140%] -rotate-12 bg-gray-400 opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ✅ AVAILABLE UNITS BELOW */}
            {size &&
              productData.stock &&
              productData.stock[size] !== undefined && (
                <p className="text-sm text-gray-600">
                  Available:{" "}
                  <span className="font-medium">
                    {productData.stock[size]} units
                  </span>
                </p>
              )}
          </div>


          <button
            onClick={() =>
              addToCart(productData._id, size)
            }
            className="bg-black text-white px-8 py-3"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        discountPercent={productData.discountPercent}
      />

      {/* 🔍 ZOOM MODAL
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setIsZoomOpen(false)}
          >
            ✕
          </button>

          <div
            className="relative w-[75vw] h-[85vh] overflow-hidden
              flex items-center justify-center
              pt-[env(safe-area-inset-top)]"
            onWheel={(e) => {
              e.preventDefault();
              setZoomLevel((z) =>
                Math.min(
                  4,
                  Math.max(
                    1,
                    z + (e.deltaY < 0 ? 0.15 : -0.15)
                  )
                )
              );
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
              };
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
              });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <img
              src={image}
              alt=""
              draggable={false}
              className="select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                cursor: isDragging
                  ? "grabbing"
                  : "grab",
              }}
            />
          </div>
        </div>
      )} */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">

          {/* Top Header/Controls */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex gap-4">
              <button
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                title="Zoom In"
              >
                <span className="text-2xl font-light">+</span>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                title="Zoom Out"
              >
                <span className="text-2xl font-light">−</span>
              </button>
              <button
                className="px-4 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest border border-white/20 backdrop-blur-md transition-all"
                onClick={() => { setZoomLevel(1); setPosition({ x: 0, y: 0 }); }}
              >
                Reset
              </button>
            </div>

            <button
              className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-90"
              onClick={() => setIsZoomOpen(false)}
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Interaction Area */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onWheel={(e) => {
              const delta = e.deltaY < 0 ? 0.2 : -0.2;
              setZoomLevel(z => Math.min(4, Math.max(1, z + delta)));
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            // ✅ Mobile Touch Support
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                setIsDragging(true);
                dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
              }
            }}
            onTouchMove={(e) => {
              if (!isDragging || e.touches.length !== 1) return;
              setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            <div
              className="transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <img
                src={image}
                alt="Zoomed Product"
                draggable={false}
                className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl rounded-sm transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              />
            </div>
          </div>

          {/* Bottom Instructions (Hidden on very small screens) */}
          <div className="absolute bottom-6 text-white/40 text-[10px] uppercase tracking-[0.2em] pointer-events-none hidden sm:block">
            Pinch or Scroll to Zoom • Drag to Move
          </div>
        </div>
      )}
    </div>
  ) : (
    <div />
  );
};

export default Product;
