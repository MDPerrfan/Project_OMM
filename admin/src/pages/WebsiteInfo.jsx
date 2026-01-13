import React, { useEffect, useState } from "react";
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const WebsiteInfo = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [websiteInfo, setWebsiteInfo] = useState({
    storeAddress: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    companyDescription: "",
    logo: "",
    heroImage: "",
    contactImage: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [contactImageFile, setContactImageFile] = useState(null);

  const fetchWebsiteInfo = async () => {
    try {
      setFetching(true);
      const response = await axios.get(backendUrl + "/api/website/get");
      if (response.data.success) {
        setWebsiteInfo(response.data.websiteInfo);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch website information");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWebsiteInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWebsiteInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add text fields
      formData.append("storeAddress", websiteInfo.storeAddress);
      formData.append("phone", websiteInfo.phone);
      formData.append("email", websiteInfo.email);
      formData.append("instagram", websiteInfo.instagram);
      formData.append("facebook", websiteInfo.facebook);
      formData.append("companyDescription", websiteInfo.companyDescription);
      
      // Add existing image URLs (to preserve if not updating)
      if (websiteInfo.logo && !logoFile) formData.append("logo", websiteInfo.logo);
      if (websiteInfo.heroImage && !heroImageFile) formData.append("heroImage", websiteInfo.heroImage);
      if (websiteInfo.contactImage && !contactImageFile) formData.append("contactImage", websiteInfo.contactImage);
      
      // Add new image files if selected
      if (logoFile) formData.append("logo", logoFile);
      if (heroImageFile) formData.append("heroImage", heroImageFile);
      if (contactImageFile) formData.append("contactImage", contactImageFile);

      const response = await axios.post(
        backendUrl + "/api/website/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset file inputs
        setLogoFile(null);
        setHeroImageFile(null);
        setContactImageFile(null);
        // Refresh data
        fetchWebsiteInfo();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loading message="Loading website information..." />;
  }

  return (
    <>
      {loading && <Loading message="Updating website information..." />}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-6"
      >
      <h2 className="text-2xl font-bold mb-4">Website Information Management</h2>

      {/* Contact Information Section */}
      <div className="w-full border-b pb-6">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <p className="mb-2">Store Address</p>
            <textarea
              className="w-full max-w-[600px] px-3 py-2 border"
              name="storeAddress"
              placeholder="Enter store address"
              value={websiteInfo.storeAddress}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <p className="mb-2">Phone Number</p>
              <input
                className="w-full px-3 py-2 border"
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={websiteInfo.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <p className="mb-2">Email</p>
              <input
                className="w-full px-3 py-2 border"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={websiteInfo.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <p className="mb-2">Instagram Link</p>
              <input
                className="w-full px-3 py-2 border"
                type="text"
                name="instagram"
                placeholder="Enter Instagram URL or handle"
                value={websiteInfo.instagram}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <p className="mb-2">Facebook Link</p>
              <input
                className="w-full px-3 py-2 border"
                type="text"
                name="facebook"
                placeholder="Enter Facebook URL or page name"
                value={websiteInfo.facebook}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2">Company Description (Footer)</p>
            <textarea
              className="w-full max-w-[600px] px-3 py-2 border"
              name="companyDescription"
              placeholder="Enter company description"
              value={websiteInfo.companyDescription}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="w-full border-b pb-6">
        <h3 className="text-xl font-semibold mb-4">Images</h3>
        
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div>
            <p className="mb-2">Logo</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {websiteInfo.logo && (
                <img
                  src={websiteInfo.logo}
                  alt="Current logo"
                  className="w-32 h-32 object-contain border"
                />
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer border px-4 py-2 inline-block w-fit hover:bg-gray-100">
                  {logoFile ? "Change Logo" : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {logoFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <p className="mb-2">Hero Image</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {websiteInfo.heroImage && (
                <img
                  src={websiteInfo.heroImage}
                  alt="Current hero image"
                  className="w-64 h-32 object-cover border"
                />
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer border px-4 py-2 inline-block w-fit hover:bg-gray-100">
                  {heroImageFile ? "Change Hero Image" : "Upload Hero Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {heroImageFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {heroImageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Image */}
          <div>
            <p className="mb-2">Contact Page Image</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {websiteInfo.contactImage && (
                <img
                  src={websiteInfo.contactImage}
                  alt="Current contact image"
                  className="w-64 h-32 object-cover border"
                />
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer border px-4 py-2 inline-block w-fit hover:bg-gray-100">
                  {contactImageFile ? "Change Contact Image" : "Upload Contact Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setContactImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {contactImageFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {contactImageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-32 py-3 mt-4 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Updating..." : "UPDATE"}
      </button>
    </form>
    </>
  );
};

export default WebsiteInfo;
