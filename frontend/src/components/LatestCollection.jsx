import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductGridSkeleton from "./ProductGridSkeleton";

const isProductOutOfStock = (p) => {
  const sizes = Array.isArray(p?.sizes) ? p.sizes : [];
  const stock = p?.stock || {};

  // If no sizes data, don't treat as out of stock (show it)
  if (sizes.length === 0) return false;

  // Out of stock if every size is 0 or missing
  return sizes.every((s) => Number(stock?.[s] ?? 0) <= 0);
};

const LatestCollection = () => {
  const { products, loadingProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const inStockOnly = (products || []).filter((p) => !isProductOutOfStock(p));
    setLatestProducts(inStockOnly.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          The wait is over. Shop our new arrivals and stay ahead of the trends
          with the season's most-coveted styles.
        </p>
      </div>

      {loadingProducts ? (
        <ProductGridSkeleton count={10} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              discountPercent={item.discountPercent}
              stock={item.stock}
              sizes={item.sizes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
