import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import Loading from "../components/Loading";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, loadingProducts } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (loadingProducts) {
    return <Loading message="Loading product..." />;
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                src={item}
                alt="product_image"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* Product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-3.5 h-3.5 text-gray-300 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          {(() => {
            const dp = Number(productData.discountPercent || 0);
            const hasDiscount = dp > 0;
            const discountedPrice = hasDiscount
              ? Math.round(productData.price * (1 - dp / 100))
              : productData.price;

            return (
              <div className="mt-5 flex items-end gap-3">
                <p className="text-3xl font-medium">
                  {currency}{discountedPrice}
                </p>

                {hasDiscount && (
                  <>
                    <p className="text-lg text-gray-500 line-through">
                      {currency}{productData.price}
                    </p>
                    <span className="text-sm font-medium text-green-600">
                      -{dp}%
                    </span>
                  </>
                )}
              </div>
            );
          })()}

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => {
                const stockCount = productData.stock && productData.stock[item] !== undefined
                  ? productData.stock[item]
                  : null;
                const isOutOfStock = stockCount === 0 || stockCount === null;
                const isSelected = item === size;

                return (
                  <button
                    onClick={() => !isOutOfStock && setSize(item)}
                    key={index}
                    disabled={isOutOfStock}
                    className={`border py-2 px-4 relative overflow-hidden ${isOutOfStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                        : isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    title={isOutOfStock ? "Not available" : `Stock: ${stockCount ?? "N/A"}`}
                  >
                    {item}

                    {/* show stock count if you want */}
                    {stockCount !== null && stockCount !== undefined && (
                      <span className={`ml-2 text-xs ${isOutOfStock ? "text-gray-400" : "text-gray-600"}`}>
                        ({stockCount})
                      </span>
                    )}

                    {/* ✅ Diagonal "half cross" line when unavailable */}
                    {isOutOfStock && (
                      <span className="pointer-events-none absolute left-[-20%] top-1/2 h-[2px] w-[140%] -rotate-12 bg-gray-400 opacity-70" />
                    )}
                  </button>

                );
              })}
            </div>
            {size && productData.stock && productData.stock[size] !== undefined && (
              <p className="text-sm text-gray-600">
                Available: <span className="font-medium">{productData.stock[size]} units</span>
              </p>
            )}
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and review section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

        </div>
      </div>
      {/* display related products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        discountPercent={productData.discountPercent}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
