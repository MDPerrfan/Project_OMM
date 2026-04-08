import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getGuestId } from "../utils/guestId";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "৳";
  const deliveryFee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Product loading error state
  const [productsError, setProductsError] = useState(false);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  const [guestId] = useState(getGuestId());
  const [websiteInfo, setWebsiteInfo] = useState(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingWebsiteInfo, setLoadingWebsiteInfo] = useState(true);

  const navigate = useNavigate();

  const addToCart = useCallback(async (itemId, size) => {
    if (!size) {
      return toast.error("Select Size");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart");

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }, [backendUrl, cartItems, token]);

  const cartCount = useMemo(() => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log("Error in getCartCount: ", error);
        }
      }
    }
    return totalCount;
  }, [cartItems]);

  const updateQuantity = useCallback(async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }, [backendUrl, cartItems, token]);

  const cartAmount = useMemo(() => {
    const productsById = new Map(products.map((product) => [product._id, product]));
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = productsById.get(items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          try {
            totalAmount += itemInfo.price * cartItems[items][item];
          } catch (error) {}
        }
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  // ✅ Rename to fetchProducts so UI can call it on "Try Again"
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      setProductsError(false); // ✅ clear error when retrying

      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
        setProductsError(false); // ✅ success
      } else {
        setProductsError(true);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setProductsError(true); // ✅ network/server error
      toast.error(error.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [backendUrl]);

  const getWebsiteInfo = useCallback(async () => {
    try {
      setLoadingWebsiteInfo(true);
      const response = await axios.get(backendUrl + "/api/website/get");
      if (response.data.success) {
        setWebsiteInfo(response.data.websiteInfo);
      }
    } catch (error) {
      console.log(error);
      // website info is optional, so no toast
    } finally {
      setLoadingWebsiteInfo(false);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async (token) => {
    try {
      setLoadingCart(true);
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingCart(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    fetchProducts();
    getUserCart(token);
    getWebsiteInfo();
  }, []);

  const getCartCount = useCallback(() => cartCount, [cartCount]);
  const getCartAmount = useCallback(() => cartAmount, [cartAmount]);

  const value = useMemo(() => ({
    products,
    currency,
    deliveryFee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,

    navigate,
    backendUrl,

    token,
    setToken,
    guestId,

    websiteInfo,

    loadingProducts,
    loadingCart,
    loadingWebsiteInfo,

    // ✅ expose error + retry function
    productsError,
    fetchProducts,
  }), [
    products,
    currency,
    deliveryFee,
    search,
    showSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    guestId,
    websiteInfo,
    loadingProducts,
    loadingCart,
    loadingWebsiteInfo,
    productsError,
    fetchProducts,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
