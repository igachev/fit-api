require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

exports.uploadImage = (image) => {
    return cloudinary.uploader.upload(image, {
        resource_type: "auto",
      });
      
}