import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";
import Loading from "../components/Loading";
import { Trash2Icon } from "lucide-react";

const POLL_INTERVAL = 15000; // 15 seconds

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      setUpdating(true);
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteHandler = async (id) => {
    if (deletingId) return; // Prevent multiple simultaneous deletes
    
    if (!window.confirm("Are you sure to delete the order info?")) {
      return;
    }
    
    try {
      setDeletingId(id);
      const response = await axios.post(backendUrl + '/api/order/delete-order', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success("Order info removed!")
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setDeletingId(null);
    }
  }
  useEffect(() => {
    fetchAllOrders();

    // Vercel does not support WebSockets (long-lived TCP connections).
    // We use plain HTTP polling instead — simple and reliable on serverless.
    const interval = setInterval(fetchAllOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [token]);

  if (loading && orders.length === 0) {
    return <Loading message="Loading orders..." />;
  }

  return (
    <div>
      {updating && <Loading message="Updating order status..." />}
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="parcel-icon" />
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className="py-0.5" key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index !== order.items.length - 1 && ","}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.fullAddress + ", "}</p>
                <p>
                  {order.address.district +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}{order.amount}
            </p>
            <div className="flex gap-2 justify-between items-center">
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button 
                onClick={() => deleteHandler(order._id)}
                disabled={deletingId === order._id}
                className={deletingId === order._id ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Trash2Icon className="size-4 text-red-400" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;