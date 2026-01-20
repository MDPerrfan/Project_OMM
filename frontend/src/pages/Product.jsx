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

  // 🔍 Zoom & pan
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

  // 🔒 LOCK BODY SCROLL WHEN MODAL OPEN
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isZoomOpen]);

  if (loadingProducts) {
    return <Loading message="Loading product..." />;
  }

  return productData ? (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 flex-col sm:flex-row">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col sm:w-[18.7%] overflow-auto">
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

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">
            {productData.name}
          </h1>
          <p className="mt-4 text-gray-500">
            {productData.description}
          </p>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="mt-6 bg-black text-white px-8 py-3"
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

      {/* 🔍 ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-white text-3xl z-50"
            onClick={() => setIsZoomOpen(false)}
          >
            ✕
          </button>

          {/* BIG CANVAS */}
          <div
            className="relative w-[95vw] h-[95vh] overflow-hidden flex items-center justify-center"
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoomLevel((z) =>
                Math.min(
                  4,
                  Math.max(1, z + (e.deltaY < 0 ? 0.15 : -0.15))
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
              alt="Zoomed"
              draggable={false}
              className="select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging
                  ? "none"
                  : "transform 0.15s ease",
                cursor: isDragging ? "grabbing" : "grab",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 px-5 py-3 rounded">
              <button
                onClick={() =>
                  setZoomLevel((z) => Math.max(1, z - 0.2))
                }
                className="text-white text-xl"
              >
                −
              </button>
              <span className="text-white text-sm">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() =>
                  setZoomLevel((z) => Math.min(4, z + 0.2))
                }
                className="text-white text-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div />
  );
};

export default Product;
