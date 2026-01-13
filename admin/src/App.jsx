import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import WebsiteInfo from "./pages/WebsiteInfo";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "৳"

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Socket.io connection for real-time order notifications
  useEffect(() => {
    if (token) {
      // Connect to Socket.io server
      const socket = io(backendUrl, {
        transports: ["websocket", "polling"],
      });

      // Listen for new order notifications
      socket.on("newOrder", (orderData) => {
        toast.success(
          `🛒 New Order! ${orderData.orderItems} item(s) - ${currency}${orderData.orderAmount}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      });

      // Cleanup on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/add" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/website-info" element={<WebsiteInfo token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
