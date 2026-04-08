import React, { useMemo,useContext } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../contexts/ShopContext";
import ServiceUnavailable from "../components/ServiceUnavailable";
const Sell = () => {
const { products,loadingProducts,productsError,fetchProducts} = useContext(ShopContext);
  const discountedProducts = useMemo(() => {
    return (products || [])
      .filter((p) => Number(p.discountPercent || 0) > 0)
      // optional: show highest discount first
      .sort((a, b) => Number(b.discountPercent || 0) - Number(a.discountPercent || 0));
  }, [products]);

  if (productsError) {
    return <ServiceUnavailable onRetry={fetchProducts} />;
  }
  return (
    <div className="border-t pt-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"ON"} text2={"SALE"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discounted items only — grab the best deals before they’re gone.
        </p>
      </div>

      {!loadingProducts && discountedProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No discounted products right now.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {discountedProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              discountPercent={item.discountPercent} 
              sizes={item.sizes}
              stock={item.stocks}// ✅ make sure ProductItem supports this prop
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sell;
