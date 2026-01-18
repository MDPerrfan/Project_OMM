import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, discountPercent }) => {
  const { currency } = useContext(ShopContext);
  const dp = Number(discountPercent || 0);
  const hasDiscount = dp > 0;
  const discountedPrice = hasDiscount ? Math.round(price * (1 - dp / 100)) : price;

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt="product_image"
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <div className="text-sm font-medium flex gap-2 items-center">
        {hasDiscount ? (
          <>
            {/* Actual price first (cut) */}
            <span className="text-gray-400 line-through text-xs">
              {currency}{price}
            </span>

            {/* Discounted price after */}
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
