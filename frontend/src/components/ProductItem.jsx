import React, { useContext, useMemo } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, discountPercent = 0, stock = {}, sizes = [] }) => {
  const { currency } = useContext(ShopContext);

  const dp = Number(discountPercent || 0);
  const hasDiscount = dp > 0;

  const discountedPrice = useMemo(() => {
    if (!hasDiscount) return price;
    return Math.round(Number(price) * (1 - dp / 100));
  }, [price, dp, hasDiscount]);

  // ✅ Product is out of stock if every size has 0 (or missing)
  const isOutOfStock = useMemo(() => {
    if (!sizes || sizes.length === 0) return false; // if no sizes data, don’t block card
    return sizes.every((s) => Number(stock?.[s] ?? 0) <= 0);
  }, [sizes, stock]);

  return (
    <Link className="text-gray-700 cursor-pointer group" to={`/product/${id}`}>
      <div className="relative overflow-hidden rounded-md">
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

        {/* Out of Stock badge */}
        {isOutOfStock && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-white/90 border text-gray-800 text-[10px] sm:text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Out of Stock
            </span>
          </div>
        )}

      </div>

      <p className="pt-3 pb-1 text-sm line-clamp-1">{name}</p>

      {/* Price display: actual first (cut), discounted after */}
      <div className="text-sm font-medium flex gap-2 items-center">
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
  );
};

export default ProductItem;
