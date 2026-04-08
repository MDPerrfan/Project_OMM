import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";

const Hero = () => {
  const { websiteInfo, loadingWebsiteInfo } = useContext(ShopContext);
  
  if (loadingWebsiteInfo || !websiteInfo?.heroImage) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-md">
      {/* Hero left side */}
    
      {/* Hero right side */}
      <img className="w-full sm:w-full rounded-md" src={websiteInfo.heroImage} alt="hero_img" />
    </div>
  );
};

export default Hero;
