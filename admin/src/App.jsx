import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileTopbar from "./components/MobileTopbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import WebsiteInfo from "./pages/WebsiteInfo";
import SizeChart from "./pages/SizeChart";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "৳";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <MobileTopbar />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-full md:w-[70%] mx-auto md:ml-[max(5vw,25px)] my-8 px-4 md:px-0 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/add" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route
                  path="/website-info"
                  element={<WebsiteInfo token={token} />}
                />
                <Route
                  path="/size-chart"
                  element={<SizeChart token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
