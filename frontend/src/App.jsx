import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "./contexts/ShopContext";
import { Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Verify from "./pages/Verify";
// import BkashCallback from "./pages/BkashCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Preloader from "./components/Preloader";

const App = () => {
  const { loadingProducts, loadingWebsiteInfo, websiteInfo } = useContext(ShopContext);
  const [showPreloader, setShowPreloader] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);

  const criticalImageUrls = useMemo(
    () => [websiteInfo?.heroImage, websiteInfo?.logo].filter(Boolean),
    [websiteInfo]
  );

  useEffect(() => {
    if (loadingProducts || loadingWebsiteInfo) return;

    if (!criticalImageUrls.length) {
      setAssetsReady(true);
      return;
    }

    let cancelled = false;
    let loadedCount = 0;

    const markDone = () => {
      loadedCount += 1;
      if (!cancelled && loadedCount >= criticalImageUrls.length) {
        setAssetsReady(true);
      }
    };

    criticalImageUrls.forEach((src) => {
      const img = new Image();
      img.onload = markDone;
      img.onerror = markDone;
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [criticalImageUrls, loadingProducts, loadingWebsiteInfo]);

  useEffect(() => {
    if (!assetsReady) return;
    const timeout = setTimeout(() => setShowPreloader(false), 250);
    return () => clearTimeout(timeout);
  }, [assetsReady]);

  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        {/* <Route path="/bkash/callback" element={<BkashCallback />} /> */}
        <Route path="/privacy" element={<PrivacyPolicy/>} />
      </Routes>
      <Footer />
      <SpeedInsights />
      <Analytics />
    </div>
  );
};

export default App;
