import React, { useContext } from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../contexts/ShopContext";

const Contact = () => {
  const { websiteInfo } = useContext(ShopContext);
  
  // Use dynamic data if available, otherwise fallback to static assets
  const contactImage = websiteInfo?.contactImage || assets.contact;
  const storeAddress = websiteInfo?.storeAddress || "";
  const phone = websiteInfo?.phone || "";
  const email = websiteInfo?.email || "";

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={contactImage}
          alt="contact_img"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <div className="flex flex-col justify-center items-start gap-6">
            <p className="font-semibold text-xl text-gray-600">Our Store</p>
            <p className="text-gray-500 whitespace-pre-line">
              {storeAddress}
            </p>
            <p className="text-gray-500">
              Tel: {phone} <br /> Email: {email}
            </p>
            <p className="font-semibold text-xl text-gray-600">
              Careers at Forever
            </p>
            <p className="text-gray-500">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
