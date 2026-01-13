import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "./Title";

const CartTotal = ({ shippingFee }) => {
  const { currency, deliveryFee, getCartAmount } = useContext(ShopContext);
  const fee = shippingFee !== undefined ? shippingFee : deliveryFee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm ">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {getCartAmount()}.00
          </p>
        </div>
        <hr />
        <div>
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>
              {currency}
              {fee}.00
            </p>
          </div>
        </div>
        <hr />
        <div>
          <div className="flex justify-between">
            <b>Total</b>
            <b>
              {currency}
              {getCartAmount() === 0 ? 0 : getCartAmount() + fee}.00
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
