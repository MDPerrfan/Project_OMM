import mongoose from "mongoose";

const websiteInfoSchema = new mongoose.Schema({
  // Contact Information
  storeAddress: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  instagram: { type: String, default: "" },
  facebook: { type: String, default: "" },
  companyDescription: { type: String, default: "" },

    // Images (Cloudinary URLs)
    logo: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    contactImage: { type: String, default: "" },
    aboutImage: { type: String, default: "" },

    // Last updated timestamp
    updatedAt: { type: Number, default: Date.now },
});

const websiteInfoModel =
    mongoose.models.websiteInfo || mongoose.model("websiteInfo", websiteInfoSchema);

export default websiteInfoModel;