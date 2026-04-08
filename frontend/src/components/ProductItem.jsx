import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { Link } from "react-router-dom";
import { toast } from "../utils/toast";

const ProductItem = ({ id, image, name, price, discountPercent = 0, stock = {}, sizes = [] }) => {
  const { currency, addToCart, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  const dp = Number(discountPercent || 0);
  const hasDiscount = dp > 0;

  const discountedPrice = useMemo(() => {
    if (!hasDiscount) return price;
    return Math.round(Number(price) * (1 - dp / 100));
  }, [price, dp, hasDiscount]);

  // Product is out of stock if every size has 0 (or missing)
  const isOutOfStock = useMemo(() => {
    if (!sizes || sizes.length === 0) return false; // if no sizes data, don’t block card
    return sizes.every((s) => Number(stock?.[s] ?? 0) <= 0);
  }, [sizes, stock]);

  const availableSizes = useMemo(
    () => (sizes || []).filter((s) => Number(stock?.[s] ?? 0) > 0),
    [sizes, stock]
  );
  const defaultSize = availableSizes[0];

  const productCartBySize = cartItems?.[id] || {};
  const productCartEntries = Object.entries(productCartBySize).filter(
    ([, quantity]) => Number(quantity) > 0
  );

  const handleQuickCartOpen = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (!defaultSize) {
      toast.error("No size available");
      return;
    }

    await addToCart(id, defaultSize);
    setIsCartSidebarOpen(true);
  };

  const handleQuantityChange = (sizeKey, nextQuantity) => {
    const normalizedQuantity = Math.max(0, Number(nextQuantity));
    updateQuantity(id, sizeKey, normalizedQuantity);
    if (normalizedQuantity === 0) {
      setIsCartSidebarOpen(false);
    }
  };

  return (
    <>
      <Link className="text-gray-700  cursor-pointer group shadow-md pb-6 rounded-md block" to={`/product/${id}`}>
      <div className="relative overflow-hidden">
        {/* SALE badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-1/2 -translate-x-1/2 z-10">
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full tracking-wide">
              SALE
            </span>
          </div>
        )}

        <img
          className="hover:scale-110 transition ease-in-out duration-300 w-full"
          src={image?.[0]}
          alt="product_image"
        />

        <button
          type="button"
          onClick={handleQuickCartOpen}
          className="absolute top-3 right-3 z-20 rounded-full bg-white/90 p-2 shadow hover:bg-white transition"
          aria-label="Open quick cart"
          title="Quick cart"
        >
          <svg
            className="w-4 h-4 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.8 2.2A1 1 0 006 17h11m0 0a2 2 0 110 4 2 2 0 010-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>

        {/* Out of Stock badge */}
        {isOutOfStock && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-white/90 border text-gray-800 text-[10px] sm:text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Out of Stock
            </span>
          </div>
        )}

      </div>

      <p className="pt-3 px-3 pb-1 text-sm line-clamp-1">{name}</p>

      {/* Price display: actual first (cut), discounted after */}
      <div className="text-sm font-medium px-3 flex gap-2 items-center">
        {hasDiscount ? (
          <>
            <span className="text-gray-400 line-through text-xs">
              {currency}{price}
            </span>
            <span>
              {currency}{discountedPrice}
            </span>
          </>
        ) : (
          <span>
            {currency}{price}
          </span>
        )}
      </div>
      </Link>

      {isCartSidebarOpen && (
        <div className="fixed inset-0 z-[120]">
          <div
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsCartSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-1/2 min-w-[220px] bg-white shadow-2xl p-4 overflow-y-auto sm:w-full sm:max-w-sm sm:p-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold">Quick Cart</h3>
              <button
                type="button"
                onClick={() => setIsCartSidebarOpen(false)}
                className="text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <img src={image?.[0]} alt={name} className="w-16 h-16 object-cover rounded" />
              <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-gray-500">
                  {currency}
                  {hasDiscount ? discountedPrice : price}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {productCartEntries.length === 0 ? (
                <p className="text-sm text-gray-500">No items in quick cart.</p>
              ) : (
                productCartEntries.map(([sizeKey, quantity]) => (
                  <div key={sizeKey} className="border rounded p-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Size: {sizeKey}</span>
                      <span>Qty: {quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="border px-2 py-1"
                        onClick={() => handleQuantityChange(sizeKey, Number(quantity) - 1)}
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="border px-2 py-1"
                        onClick={() => handleQuantityChange(sizeKey, Number(quantity) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartSidebarOpen(false);
                navigate("/cart");
              }}
              className="mt-6 w-full bg-black text-white py-3 text-sm"
            >
              GO TO BUY
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductItem;
