import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import HeroSkeleton from "./HeroSkeleton";

const Hero = () => {
  const { websiteInfo, loadingWebsiteInfo } = useContext(ShopContext);
  
  if (loadingWebsiteInfo || !websiteInfo?.heroImage) {
    return <HeroSkeleton />;
  }

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero left side */}
    
      {/* Hero right side */}
      <img className="w-full sm:w-full" src={websiteInfo.heroImage} alt="hero_img" />
    </div>
  );
};

export default Hero;
