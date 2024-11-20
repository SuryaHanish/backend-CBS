"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Debugging: Check if the environment variables are being loaded correctly
console.log("Cloudinary Config:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
console.log("Cloudinary connected");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
