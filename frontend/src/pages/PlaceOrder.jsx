import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios";
import { toast } from "../utils/toast";
import { useUser } from "@clerk/clerk-react";
import Loading from "../components/Loading";

const PlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const {
    navigate,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    token,
    guestId,
  } = useContext(ShopContext);
  const { user } = useUser();

  // All 64 districts of Bangladesh
  const districtOptions = [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Cumilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
    "Barguna",
    "Barishal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
    "Bagerhat",
    "Chuadanga",
    "Jashore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
    "Bogura",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Chapai Nawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
    "Habiganj",
    "Moulvibazar",
    "Sunamganj",
    "Sylhet",
    "Jamalpur",
    "Mymensingh",
    "Netrokona",
    "Sherpur",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fullAddress: "",
    district: "",
    city: "",
    zipcode: "",
    country: "Bangladesh",
    phone: "",
  });

  const shippingFee =
    formData.district === ""
      ? 0
      : formData.district === "Dhaka"
      ? 70
      : 130;

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item]) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        userId: user?.id || guestId,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + shippingFee,
      };

      if (paymentMethod === "COD") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          token ? { headers: { token } } : {}
        );

        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      } else if (paymentMethod === "BKASH") {
        const response = await axios.post(
          backendUrl + "/api/order/bkash/create",
          orderData,
          token ? { headers: { token } } : {}
        );

        if (response.data.success && response.data.bkashURL) {
          setCartItems({});
          window.location.href = response.data.bkashURL;
        } else {
          toast.error(response.data.message || "Failed to initiate bKash payment");
        }
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading message="Placing your order..." />}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        {/* left side */}
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name*"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
        />
        <textarea
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Full Address*"
          onChange={onChangeHandler}
          name="fullAddress"
          value={formData.fullAddress}
          rows="3"
        />
        <div className="flex gap-3">
          <select
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            name="district"
            value={formData.district}
            onChange={onChangeHandler}
          >
            <option value="">Select District</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
          />
        </div>
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone*"
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
        />
      </div>
      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal shippingFee={shippingFee} />
        </div>
          <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <button
              type="button"
              onClick={() => setPaymentMethod("COD")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                paymentMethod === "COD" ? "border-black" : "border-gray-300"
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "COD" ? "bg-green-400" : "bg-white"
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </button>
            {/* <button
              type="button"
              onClick={() => setPaymentMethod("BKASH")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                paymentMethod === "BKASH" ? "border-black" : "border-gray-300"
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "BKASH" ? "bg-green-400" : "bg-white"
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                bKash
              </p>
            </button> */}
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
    </>
  );
};

export default PlaceOrder;
